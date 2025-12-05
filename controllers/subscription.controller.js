import Subscription from '../models/subscription.model.js';
import WorkflowClient from '../config/upstash.js';
import { SERVER_URL, QSTASH_URL, QSTASH_TOKEN } from '../config/env.js';
import { Client as QStashClient } from '@upstash/qstash';

export const createSubscription = async (req, res, next) => {
    try {
        const { name, price, currency, frequency, category, paymentMethod, startDate, renewalDate } = req.body;
        
        // Calculate renewalDate if not provided
        let calculatedRenewalDate = renewalDate;
        if (!calculatedRenewalDate) {
            if (!frequency) {
                const error = new Error('Frequency is required when renewalDate is not provided');
                error.statusCode = 400;
                throw error;
            }
            
            const renewalPeriods = {
                daily: 1,
                weekly: 7,
                monthly: 30,
                yearly: 365,
            };
            
            calculatedRenewalDate = new Date(startDate);
            calculatedRenewalDate.setDate(calculatedRenewalDate.getDate() + renewalPeriods[frequency]);
        }
        
        // Check if renewal date has passed to set status
        let status = 'active';
        if (calculatedRenewalDate < new Date()) {
            status = 'expired';
        }
        
        const subscription = await Subscription.create({
            name,
            price,
            currency,
            frequency,
            category,
            paymentMethod,
            startDate,
            renewalDate: calculatedRenewalDate,
            status,
            user: req.user._id
        });
        
        // Trigger workflow for reminders (only if QStash is configured)
        let workflowRunId = null;
        
        // Get token value - ensure it's available
        const qstashToken = QSTASH_TOKEN;
        
        // Check configuration
        if (!qstashToken || String(qstashToken).trim() === '') {
            console.warn('QStash not configured: QSTASH_TOKEN is required for workflows');
        } else if (!WorkflowClient) {
            console.warn('WorkflowClient is not initialized. Check QSTASH_TOKEN configuration.');
        } else if (!SERVER_URL) {
            console.warn('SERVER_URL is not configured. Cannot trigger workflow.');
        } else {
            try {
                // For local QStash, use 127.0.0.1 instead of localhost to ensure connectivity
                let workflowUrl = `${SERVER_URL}/api/v1/workflows/subscription/reminder`;
                
                // If using local QStash and SERVER_URL is localhost, convert to 127.0.0.1
                if (QSTASH_URL && QSTASH_URL.includes('127.0.0.1') && workflowUrl.includes('localhost')) {
                    workflowUrl = workflowUrl.replace('localhost', '127.0.0.1');
                }
                
                const requestPayload = { subscriptionId: subscription._id.toString() };
                
                console.log('Triggering workflow:', { 
                    workflowUrl, 
                    requestPayload, 
                    hasQstashToken: !!QSTASH_TOKEN,
                    qstashUrl: QSTASH_URL || 'using default cloud URL'
                });
                
                // For Upstash Workflow, the trigger method signature is: trigger(workflowUrl, requestPayload)
                // Note: There's a known issue with @upstash/workflow v0.2.22 and local QStash servers
                // where trigger() fails with "Failed to infer request path" error.
                // Workaround: Use QStash client directly to publish messages
                let result;
                try {
                    // Try the standard trigger method first
                    result = await WorkflowClient.trigger(workflowUrl, requestPayload);
                } catch (triggerError) {
                    // If trigger fails with path inference error (common with local QStash)
                    if (triggerError.message && triggerError.message.includes('Failed to infer request path')) {
                        // Use direct fetch to publish to QStash
                        try {
                            // Get token
                            const token = String(qstashToken || QSTASH_TOKEN || '').trim();
                            if (!token) {
                                throw new Error('QSTASH_TOKEN is empty or not set');
                            }
                            
                            // Prepare QStash base URL
                            const qstashBaseUrl = (QSTASH_URL || 'http://127.0.0.1:8080')
                                .replace('/v2', '')
                                .replace(/\/$/, '');
                            
                            // QStash API: POST {baseUrl}/v2/publish/{targetUrl}
                            const publishUrl = `${qstashBaseUrl}/v2/publish/${workflowUrl}`;
                            
                            // Make the request with Authorization header
                            const fetchResponse = await fetch(publishUrl, {
                                method: 'POST',
                                headers: {
                                    'Authorization': `Bearer ${token}`,
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(requestPayload),
                            });
                            
                            const responseText = await fetchResponse.text();
                            
                            if (!fetchResponse.ok) {
                                throw new Error(`QStash publish failed: ${fetchResponse.status} - ${responseText}`);
                            }
                            
                            const publishResult = JSON.parse(responseText);
                            result = publishResult?.messageId || null;
                            
                            if (result) {
                                console.log('✅ Workflow triggered successfully - workflowRunId:', result);
                            } else {
                                console.error('❌ No messageId in QStash response:', publishResult);
                                result = null;
                            }
                        } catch (qstashError) {
                            console.error('❌ QStash publish failed:', qstashError.message);
                            result = null;
                        }
                    } else {
                        // Re-throw other errors
                        throw triggerError;
                    }
                }
                
                console.log('Workflow trigger result:', JSON.stringify(result, null, 2));
                
                // The trigger method returns the workflowRunId directly as a string
                if (typeof result === 'string' && result.length > 0) {
                    workflowRunId = result;
                } else if (result && typeof result === 'object') {
                    // Handle object response (shouldn't happen but just in case)
                    workflowRunId = result.workflowRunId || result.id || result.runId || result.workflowRunId || null;
                } else {
                    workflowRunId = result || null;
                }
                
                if (workflowRunId) {
                    console.log('✅ Workflow triggered successfully with runId:', workflowRunId);
                } else {
                    console.warn('⚠️ Workflow trigger returned null or undefined runId. Result:', result);
                }
            } catch (workflowError) {
                // Log workflow error but don't fail the subscription creation
                console.error('❌ Workflow trigger failed:', {
                    message: workflowError.message,
                    name: workflowError.name,
                    // Only log stack in development
                    ...(process.env.NODE_ENV === 'development' && { stack: workflowError.stack })
                });
                
                // If it's a configuration error, provide helpful message
                if (workflowError.message.includes('Failed to infer request path')) {
                    console.error('💡 Tip: Make sure SERVER_URL is publicly accessible and QSTASH_TOKEN is valid');
                }
                // Continue without workflow - subscription is still created successfully
            }
        }
        
        res.status(201).json({ success: true, data: { subscription, workflowRunId } });
    } catch (error) {  
        next(error);
    }
};
 
export const getSubscriptions = async (req, res, next) => {
    try {
        // check if the user is the owner of the subscriptions
        if (req.user.id !== req.params.id) {
            const error = new Error('You are not authorized to access this resource');
            error.statusCode = 401;
            throw error;
        }
        const subscriptions = await Subscription.find({ user: req.params.id });
        res.status(200).json({ success: true, subscriptions });
    } catch (error) {
        console.log('Subscription retrieval error', `${error}`);
        next(error);
    }
};

