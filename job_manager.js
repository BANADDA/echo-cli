#!/usr/bin/env node
const axios = require('axios');
const { program } = require('commander');
const { exec } = require('child_process');
// Set the base URL for your server API
const API_BASE_URL = 'http://localhost:3000';

program
  .version('1.0.0')
  .description('CLI tool for managing training jobs');

// List all training jobs
program
  .command('list-jobs')
  .description('List all available training jobs')
  .action(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/jobs`);
      console.log('Available Training Jobs:');
      response.data.forEach(job => {
        console.log(`Job ID: ${job.id}, Model ID: ${job.modelId}, Dataset ID: ${job.datasetId}, Status: ${job.trainingStatus}`);
      });
    } catch (error) {
      console.error('Error fetching jobs:', error.message);
    }
  });

// View metadata for a specific job
program
  .command('view-job <jobId>')
  .description('View metadata for a specific job')
  .action(async (jobId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/jobs/${jobId}`);
      console.log('Job Details:', response.data);
    } catch (error) {
      console.error(`Error fetching job ${jobId}:`, error.message);
    }
  });

// Update the status of a training job
program
  .command('update-status <jobId> <status>')
  .description('Update the status of a training job')
  .action(async (jobId, status) => {
    try {
      await axios.patch(`${API_BASE_URL}/jobs/${jobId}/status`, { status });
      console.log(`Status of job ${jobId} updated to ${status}.`);
    } catch (error) {
      console.error(`Error updating status for job ${jobId}:`, error.message);
    }
  });

// Helper function to execute shell commands
function executeCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Exec error: ${error}`);
                reject(error);
                return;
            }
            if (stderr) {
                console.error(`Stderr: ${stderr}`);
                reject(new Error(stderr));
                return;
            }
            console.log(stdout);
            resolve(stdout);
        });
    });
}

// Command to fetch and run a Docker image
program
  .command('run-image <imageTag>')
  .description('Fetch and run a specified Docker image from Docker Hub')
  .action(async (imageTag) => {
    try {
      console.log(`Pulling Docker image ${imageTag} from Docker Hub...`);
      await executeCommand(`docker pull ${imageTag}`);
      console.log(`Running Docker image ${imageTag}...`);
      await executeCommand(`docker run ${imageTag}`);
      console.log(`Docker image ${imageTag} is now running.`);
    } catch (error) {
      console.error(`Failed to pull or run Docker image ${imageTag}:`, error.message);
    }
  });

program.parse(process.argv);

program.parse(process.argv);
