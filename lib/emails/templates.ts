
export const getWelcomeEmailTemplate = (name: string, loginUrl: string) => {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to SmartFlow Africa</title>
</head>
<body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f7fa; margin: 0; padding: 0; -webkit-font-smoothing: antialiased;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); margin-top: 40px; margin-bottom: 40px;">
        
        <!-- Header / Logo -->
        <div style="text-align: center; margin-bottom: 30px;">
            <img src="${process.env.NEXT_PUBLIC_APP_URL}/newlogo.png" alt="SmartFlow Africa" style="height: 50px; width: auto;">
        </div>

        <!-- Content -->
        <div style="color: #334155; line-height: 1.6;">
            <h1 style="color: #1e293b; font-size: 24px; font-weight: 700; margin-bottom: 20px; text-align: center;">Welcome to SmartFlow, ${name}! 🚀</h1>
            
            <p style="font-size: 16px; margin-bottom: 20px;">
                We are thrilled to have you on board. Your account has been successfully created, and you are now part of the smartest way to manage business operations in Africa.
            </p>

            <p style="font-size: 16px; margin-bottom: 30px;">
                From managing jobs and inventory to automating customer communication with WhatsApp, SmartFlow is designed to help your business grow effortlessly.
            </p>

            <!-- CTA Button -->
            <div style="text-align: center; margin-bottom: 40px;">
                <a href="${loginUrl}" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 14px 30px; border-radius: 6px; font-weight: 600; font-size: 16px; transition: background-color 0.2s;">
                    Login to Dashboard
                </a>
            </div>

            <div style="background-color: #f8fafc; padding: 20px; border-radius: 6px; margin-bottom: 30px; border: 1px solid #e2e8f0;">
                <h3 style="margin-top: 0; font-size: 14px; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px;">Getting Started Tips:</h3>
                <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #475569;">
                    <li style="margin-bottom: 8px;">Complete your business profile in Settings.</li>
                    <li style="margin-bottom: 8px;">Connect your WhatsApp number to start the SmartBot.</li>
                    <li>Invite your team members to collaborate.</li>
                </ul>
            </div>
        </div>

        <!-- Footer -->
        <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; text-align: center; color: #94a3b8; font-size: 12px;">
            <p>&copy; ${new Date().getFullYear()} SmartFlow Africa. All rights reserved.</p>
            <p>
                Need assistance? <a href="mailto:support@smartflowafrica.com" style="color: #2563eb; text-decoration: none;">Contact Support</a>
            </p>
        </div>
    </div>
</body>
</html>
    `;
};
