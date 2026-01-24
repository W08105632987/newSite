/* ============================================
   MONIEKING - CONTACT FORM BACKEND
   Netlify Serverless Function
   ============================================ */

const nodemailer = require("nodemailer");

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    // Parse request body
    const data = JSON.parse(event.body);
    const { fullName, email, phone, subject, message, timestamp } = data;

    // Validate required fields
    if (!fullName || !email || !phone || !subject || !message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "All fields are required" }),
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Invalid email format" }),
      };
    }

    // Create email transporter (using Gmail)
    // For production, use SendGrid, AWS SES, or Mailgun
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASS, // App-specific password
      },
    });

    // Format timestamp
    const submissionDate = new Date(timestamp).toLocaleString("en-NG", {
      timeZone: "Africa/Lagos",
      dateStyle: "full",
      timeStyle: "short",
    });

    // Email to MonieKing (notification)
    const mailToMonieKing = {
      from: process.env.EMAIL_USER,
      to: "moniekingsolution@gmail.com",
      subject: `🔔 New Contact Form Submission - ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1a73e8 0%, #10b981 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .header h1 { margin: 0; font-size: 24px; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
            .field { margin-bottom: 20px; }
            .field-label { font-weight: 600; color: #1a73e8; margin-bottom: 5px; display: block; }
            .field-value { background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #10b981; }
            .message-box { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #1a73e8; margin-top: 20px; }
            .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 14px; }
            .badge { display: inline-block; background: #10b981; color: white; padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: 600; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📬 New Contact Form Submission</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">MonieKing Website</p>
            </div>
            <div class="content">
              <div class="field">
                <span class="field-label">📅 Submission Date:</span>
                <div class="field-value">${submissionDate}</div>
              </div>
              
              <div class="field">
                <span class="field-label">👤 Full Name:</span>
                <div class="field-value">${fullName}</div>
              </div>
              
              <div class="field">
                <span class="field-label">📧 Email Address:</span>
                <div class="field-value"><a href="mailto:${email}">${email}</a></div>
              </div>
              
              <div class="field">
                <span class="field-label">📞 Phone Number:</span>
                <div class="field-value"><a href="tel:${phone}">${phone}</a></div>
              </div>
              
              <div class="field">
                <span class="field-label">📋 Subject:</span>
                <div class="field-value"><span class="badge">${subject}</span></div>
              </div>
              
              <div class="field">
                <span class="field-label">💬 Message:</span>
                <div class="message-box">${message.replace(/\n/g, "<br>")}</div>
              </div>
              
              <div class="footer">
                <p>⚡ Respond within 24 hours for best customer experience</p>
                <p style="margin-top: 20px; font-size: 12px;">
                  This email was automatically generated from the MonieKing contact form.<br>
                  Reply directly to <a href="mailto:${email}">${email}</a> to respond to ${fullName}.
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    // Auto-reply email to customer
    const mailToCustomer = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "✅ We Received Your Message - MonieKing",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1a73e8 0%, #10b981 100%); color: white; padding: 40px; text-align: center; border-radius: 10px 10px 0 0; }
            .logo { font-size: 32px; font-weight: bold; margin-bottom: 10px; }
            .content { background: #f8fafc; padding: 40px 30px; }
            .success-icon { font-size: 48px; text-align: center; margin-bottom: 20px; }
            .message { background: white; padding: 25px; border-radius: 10px; margin: 20px 0; line-height: 1.8; }
            .highlight { background: #e0f2fe; padding: 20px; border-radius: 8px; border-left: 4px solid #1a73e8; margin: 20px 0; }
            .contact-info { background: white; padding: 20px; border-radius: 10px; margin-top: 20px; }
            .contact-item { margin: 10px 0; }
            .button { display: inline-block; background: #1a73e8; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: 600; }
            .footer { text-align: center; padding: 30px; color: #64748b; font-size: 14px; border-radius: 0 0 10px 10px; background: #f1f5f9; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">MonieKing</div>
              <p style="margin: 0; opacity: 0.9;">Empowering Financial Freedom</p>
            </div>
            <div class="content">
              <div class="success-icon">✅</div>
              
              <div class="message">
                <h2 style="color: #1a73e8; margin-top: 0;">Hello ${fullName}!</h2>
                <p>Thank you for reaching out to <strong>MonieKing</strong>. We've successfully received your message regarding <strong>"${subject}"</strong>.</p>
                <p>Our team is reviewing your inquiry and will get back to you within <strong>24 hours</strong> (typically much sooner during business hours).</p>
              </div>
              
              <div class="highlight">
                <strong>📋 What You Submitted:</strong><br><br>
                <strong>Subject:</strong> ${subject}<br>
                <strong>Submitted on:</strong> ${submissionDate}
              </div>
              
              <div style="text-align: center;">
                <a href="https://wa.me/2347031867883" class="button">💬 Chat on WhatsApp</a>
              </div>
              
              <div class="contact-info">
                <h3 style="color: #1a73e8; margin-top: 0;">📞 Need Immediate Assistance?</h3>
                <div class="contact-item">📱 <strong>Phone:</strong> +234 703 186 7883 | +234 803 899 5252</div>
                <div class="contact-item">📧 <strong>Email:</strong> moniekingsolution@gmail.com</div>
                <div class="contact-item">📍 <strong>Office:</strong> Beside Yaro Plaza, After JAMB Office, Bwari, Abuja</div>
                <div class="contact-item">🕐 <strong>Hours:</strong> Monday - Saturday, 7:00 AM - 6:00 PM WAT</div>
              </div>
            </div>
            
            <div class="footer">
              <p><strong>MonieKing</strong> - Your Trusted Financial Partner</p>
              <p style="margin-top: 10px;">
                Cooperative Savings • Low-Interest Loans • NIN/BVN Services • POS Services
              </p>
              <p style="margin-top: 20px; font-size: 12px; color: #94a3b8;">
                This is an automated confirmation email. Please do not reply to this message.<br>
                For inquiries, contact us at moniekingsolution@gmail.com
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    // Send both emails
    await Promise.all([
      transporter.sendMail(mailToMonieKing),
      transporter.sendMail(mailToCustomer),
    ]);

    // Success response
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message:
          "Your message has been sent successfully! Check your email for confirmation.",
      }),
    };
  } catch (error) {
    console.error("Contact form error:", error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error:
          "Failed to send message. Please try again or contact us directly.",
        details: error.message,
      }),
    };
  }
};
