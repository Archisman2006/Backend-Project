export const Verification_Email_Template = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 30px auto;
            background: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            border: 1px solid #ddd;
        }
        .header {
            background-color: #4CAF50;
            color: white;
            padding: 20px;
            text-align: center;
            font-size: 26px;
            font-weight: bold;
        }
        .content {
            padding: 25px;
            color: #333;
            line-height: 1.8;
        }
        .verification-code {
            display: block;
            margin: 20px 0;
            font-size: 22px;
            color: #4CAF50;
            background: #e8f5e9;
            border: 1px dashed #4CAF50;
            padding: 10px;
            text-align: center;
            border-radius: 5px;
            font-weight: bold;
            letter-spacing: 2px;
        }
        .footer {
            background-color: #f4f4f4;
            padding: 15px;
            text-align: center;
            color: #777;
            font-size: 12px;
            border-top: 1px solid #ddd;
        }
        p {
            margin: 0 0 15px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">Verify Your Email</div>
        <div class="content">
            <p>Hello,</p>
            <p>Thank you for signing up! Please confirm your email address by entering the code below:</p>
            <span class="verification-code">{verificationCode}</span>
            <p>Please note that the above code is valid for 10 minutes.</p>
            <p>If you did not create an account, no further action is required. If you have any questions, feel free to contact our support team.</p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Archisman Das. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

export const Welcome_Email_Template = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Our Community</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 30px auto;
            background: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            border: 1px solid #ddd;
        }
        .header {
            background-color: #007BFF;
            color: white;
            padding: 20px;
            text-align: center;
            font-size: 26px;
            font-weight: bold;
        }
        .content {
            padding: 25px;
            line-height: 1.8;
        }
        .welcome-message {
            font-size: 18px;
            margin: 20px 0;
        }
        .button {
            display: inline-block;
            padding: 12px 25px;
            margin: 20px 0;
            background-color: #007BFF;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            text-align: center;
            font-size: 16px;
            font-weight: bold;
            transition: background-color 0.3s;
        }
        .button:hover {
            background-color: #0056b3;
        }
        .footer {
            background-color: #f4f4f4;
            padding: 15px;
            text-align: center;
            color: #777;
            font-size: 12px;
            border-top: 1px solid #ddd;
        }
        p {
            margin: 0 0 15px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">Welcome to Our Community!</div>
        <div class="content">
            <p class="welcome-message">Hello {name},</p>
            <p>We’re thrilled to have you join us! Your registration was successful, and we’re committed to providing you with the best experience possible.</p>
            <p>Here’s how you can get started:</p>
            <ul>
                <li>Explore our features and customize your experience.</li>
                <li>Stay informed by checking out our blog for the latest updates and tips.</li>
                <li>Reach out to our support team if you have any questions or need assistance.</li>
            </ul>
            <a href="#" class="button">Get Started</a>
            <p>If you need any help, don’t hesitate to contact us. We’re here to support you every step of the way.</p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Archisman Das. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;
export const reset_password_email_template=`
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Forgot Password</title>
    <link href="https://fonts.googleapis.com/css?family=Raleway:400,700&display=swap" rel="stylesheet" type="text/css">
    <style type="text/css">
        body { 
            margin: 0; 
            padding: 0; 
            background-color: #f9f9ff; 
            font-family: 'Raleway', sans-serif; 
            color: #000000; 
            -webkit-text-size-adjust: 100%; 
        }
        table, td { 
            border-collapse: collapse; 
        }
        .wrapper { 
            width: 100%; 
            table-layout: fixed; 
            background-color: #f9f9ff; 
            padding: 40px 0; 
        }
        .container { 
            width: 100%; 
            max-width: 600px; 
            margin: 0 auto; 
            background-color: #ffffff; 
            box-shadow: 0 4px 6px rgba(0,0,0,0.05); 
        }
        .content { 
            padding: 40px 60px; 
        }
        h1 { 
            font-size: 28px; 
            font-weight: 700; 
            margin: 0 0 20px 0; 
            text-align: center; 
        }
        p { 
            font-size: 15px; 
            line-height: 1.6; 
            margin: 0 0 20px 0; 
            color: #333333; 
        }
        .link-text { 
            word-break: break-all; 
            color: #1386e5; 
            font-weight: bold; 
            text-decoration: underline; 
        }
        .btn-container { 
            text-align: center; 
            margin: 30px 0; 
        }
        .btn { 
            display: inline-block; 
            background-color: #fdb441; 
            color: #000000; 
            font-weight: bold; 
            text-decoration: none; 
            padding: 12px 30px; 
            border-radius: 25px; 
            font-size: 14px; 
        }
        .footer { 
            padding: 40px 40px; 
            text-align: center; 
            font-size: 12px; 
            line-height: 1.8; 
            color: #666666; 
            background-color: #f9f9ff; 
        }
        .footer a { 
            color: #666666; 
            text-decoration: none; 
            font-weight: bold; 
        }
        .divider { 
            border-top: 1px solid #BBBBBB; 
            margin: 20px 0; 
        }
        @media screen and (max-width: 600px) {
            .content { 
                padding: 30px 20px; 
            }
            h1 { 
                font-size: 24px; 
            }
        }
    </style>
</head>

<body>
    <table class="wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
            <td align="center">
                <table class="container" width="100%" cellpadding="0" cellspacing="0" role="presentation">
                    <tr>
                        <td class="content" align="center" style="padding-bottom: 10px;">
                            <h1>Forget password ?</h1>
                        </td>
                    </tr>
                    
                    <tr>
                        <td class="content" style="padding-top: 10px; padding-bottom: 10px;">
                            <p>If you've lost your password or wish to reset it, use the link below to get started:</p>
                            
                            <p><a href="{link}" class="link-text">Reset Password</a></p>
                            
                            <p style="font-size: 13px; color: #666666;">Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation.</p>
                            
                            <div class="btn-container">
                                <a href="{link}"  class="btn">Reset Your Password</a>
                            </div>
                        </td>
                    </tr>
                    
                    <tr>
                        <td class="footer">
                            <div class="divider"></div>
                            <p style="margin-top: 20px;">
                                <a href="#">UNSUBSCRIBE</a> &nbsp;|&nbsp; 
                                <a href="#">PRIVACY POLICY</a> &nbsp;|&nbsp; 
                                <a href="#">WEB</a>
                            </p>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;