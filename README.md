# Job Manager CLI Tool

## Description

This CLI tool allows you to manage training jobs, view job statuses, and interact with Docker images. It's designed to facilitate the management of Docker-based training environments.

## Installation

To install the CLI tool, follow these steps:

1. Clone the repository to your local machine.
2. Navigate to the CLI directory where the `job_manager.js` file is located.
3. Run the following command to install necessary dependencies:

   ```bash
   npm install

## Configuration

Set the `API_BASE_URL` environment variable to specify the URL of your server:

```bash
export API_BASE_URL=http://yourserver.com

## Usage

Here are some common commands you can use with this CLI tool:

### List all Jobs

To list all the training jobs:

```bash
./job_manager.js list-jobs

### View Job Metadata

To view metadata for a specific job:

```bash
./job_manager.js view-job <jobId>

### Update Job Status

To update the status of a training job:

```bash
./job_manager.js update-status <jobId> <status>

### Run a Docker Image

To pull and run a Docker image from Docker Hub:

```bash
./job_manager.js run-image <imageTag>
