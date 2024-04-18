#!/usr/bin/env node
const axios = require('axios');
// const inquirer = require('inquirer');
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
  
  program
  .command('complete-job <jobId> <resultsUrl> <status> <volunteerAddress>')
  .description('Mark a training job as completed, upload results, and assign rewards')
  .action(async (jobId, resultsUrl, status, volunteerAddress) => {
      try {
          const response = await axios.post(`${API_BASE_URL}/complete-job`, {
              docId: jobId,
              status: status,
              resultsUrl: resultsUrl,
              volunteerAddress: volunteerAddress
          });
          console.log('Job marked as completed:', response.data.message);
      } catch (error) {
          console.error(`Error marking job as completed:`, error.message);
      }
  });

  program
  .command('register-volunteer')
  .description('Register a new volunteer')
  .action(async () => {
    try {
      // Dynamically import the inquirer module
      const inquirer = (await import('inquirer')).default;

      // Use inquirer as normal once imported
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: 'Enter your name:',
          validate: input => !!input || 'Name is required!'
        },
        {
          type: 'input',
          name: 'email',
          message: 'Enter your email:',
          validate: input => !!input || 'Email is required!'
        }
      ]);

      // Post the registration data to the server
      const response = await axios.post(`${API_BASE_URL}/register-volunteer`, {
        name: answers.name,
        email: answers.email
      });

      // Log the successful registration
      console.log('Registration successful!');
      console.log(`Your Ethereum Address: ${response.data.ethereumAddress}`);
      console.log(`Your Private Key: ${response.data.privateKey} (SAVE THIS SECURELY)`);

    } catch (error) {
      // Handle errors from axios or inquirer
      console.error('Error during registration:', error.response ? error.response.data : error.message);
    }
  });

program.parse(process.argv);
