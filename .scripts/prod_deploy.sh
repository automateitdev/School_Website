#!/bin/bash
set -e

echo "Prod Deployment started..."

# Function to safely pull and build
deploy_site() {
    local SITE_PATH=$1
    echo "Processing: $SITE_PATH"
    
    cd "$SITE_PATH" || { echo "Directory not found!"; exit 1; }

    # --- THE FIX STARTS HERE ---
    echo "Forcing local state to match origin/main..."
    git fetch origin main
    git reset --hard origin/main  # This kills local changes to .sh and json files
    git clean -df                 # This deletes any untracked junk
    # --- THE FIX ENDS HERE ---

    echo "Installing dependencies..."
    npm install || { echo "npm install failed!"; exit 1; }

    echo "Generating static build..."
    npm run generate || { echo "npm run generate failed!"; exit 1; }
}

# Run for EIMS
deploy_site "/home/webuser/web/demo1.automate.com.bd/public_html"

echo "All deployments finished successfully!"