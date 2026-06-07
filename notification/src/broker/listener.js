import { subscribeToQueue } from "./broker.js";
import sendEmail from "../utils/email.js";

function startListener() {

    subscribeToQueue("user_create", async (msg) => {

        console.log("Message received:", msg);

        const {
  email,
  role,
  fullName: { firstName, lastName }
} = msg;

    
const template = `
<div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 30px;">
    
    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1DB954, #191414); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">
                🎵 Welcome to Spotify Piper
            </h1>
        </div>

        <!-- Body -->
        <div style="padding: 30px;">
            
            <h2 style="color: #333;">
                Hello ${firstName} ${lastName} 👋
            </h2>

            <p style="color: #555; line-height: 1.8;">
                Thank you for joining <strong>Spotify Piper</strong>.
                Your account has been successfully created and we're excited
                to have you as part of our community.
            </p>

            <div style="background: #f8f9fa; border-left: 4px solid #1DB954; padding: 15px; margin: 20px 0;">
                <p style="margin: 5px 0;">
                    <strong>Email:</strong> ${email}
                </p>

                <p style="margin: 5px 0;">
                    <strong>Role:</strong> ${role}
                </p>
            </div>

            <p style="color: #555; line-height: 1.8;">
                You can now start exploring the platform and enjoy all the features available to you.
            </p>

            <div style="text-align: center; margin: 30px 0;">
                <a href="#"
                    style="
                        background: #1DB954;
                        color: white;
                        text-decoration: none;
                        padding: 12px 24px;
                        border-radius: 6px;
                        display: inline-block;
                        font-weight: bold;
                    ">
                    Start Exploring
                </a>
            </div>

            <p style="color: #555;">
                If you have any questions, feel free to reach out to our support team.
            </p>

            <br>

            <p style="margin-bottom: 0;">
                Best Regards,
            </p>

            <p style="margin-top: 5px;">
                <strong>Spotify Piper Team 🎧</strong>
            </p>
        </div>

        <!-- Footer -->
        <div style="background: #191414; color: #aaa; text-align: center; padding: 20px;">
            <p style="margin: 0;">
                © 2026 Spotify Piper. All rights reserved.
            </p>
        </div>

    </div>

</div>
`



        await sendEmail(email, "Welcome to Spotify Piper", "Thank you for registering with Spotify Piper.", template)

    })

}

export default startListener;