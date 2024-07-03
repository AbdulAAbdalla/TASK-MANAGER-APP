# Check if Firebase CLI is already installed
if ! command -v firebase &> /dev/null
then
    echo "Firebase CLI not found, installing..."
    npm install -g firebase-tools
else
    echo "Firebase CLI is already installed"
fi

firebase login

firebase init

# Choose hosting, select your project, and follow the prompts

firebase deploy