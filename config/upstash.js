import { Client as WorkflowClient } from '@upstash/workflow';
import { QSTASH_URL, QSTASH_TOKEN } from './env.js';
  
// Only create workflow client if QStash is configured
// For local development: QSTASH_URL should be http://127.0.0.1:8080
// For cloud: QSTASH_URL can be omitted (defaults to cloud URL) or set to https://qstash.upstash.io/v2
let workflowClient = null;
if (QSTASH_TOKEN) {
    try {
        const config = { token: QSTASH_TOKEN };
        
        // Set baseUrl if provided (required for local QStash, optional for cloud)
        if (QSTASH_URL) {
            config.baseUrl = QSTASH_URL;
            console.log('Using QStash URL:', QSTASH_URL);
        } else {
            console.log('Using default QStash cloud URL');
        }
        
        workflowClient = new WorkflowClient(config);
        console.log('✅ WorkflowClient initialized successfully');
    } catch (error) {
        console.warn('Failed to initialize WorkflowClient:', error.message);
        workflowClient = null;
    }
} else {
    console.warn('QStash not configured: QSTASH_TOKEN is required for workflows');
}

export default workflowClient;