 const passwordResetEmail = (userName, resetURL) => {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p style="color: #555;">Hi ${userName},</p>
        <p style="color: #555;">We received a request to reset your password. Click the button below to reset it:</p>
        <a href="${resetURL}" style="display: inline-block; padding: 10px 20px; margin: 20px 0; font-size: 16px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p style="color: #555;">If you didn't request this, please ignore this email.</p>
        <p style="color: #555;">Thanks,</p>
        <p style="color: #555;">The Team</p>
      </div>
    `;
  };
  export default passwordResetEmail;