export function notificationEmail(name: string, message: string, link: string) {
    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
          <title>Notification</title>
          <style>
            body {
              font-family: "Raleway", sans-serif;
              background-color: #004cff;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 500px;
              margin: 30px auto;
              background: #004cff;
              padding: 20px 30px;
              border-radius: 8px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            }
            h2 {
              color: #333;
            }
            p {
              color: #fff !important;
              line-height: 1.6;
            }
            a.button {
              display: inline-block;
              background: #fff !important;
              color: #000 !important;
              text-decoration: none;
              padding: 10px 16px;
              border-radius: 6px;
              font-weight: bold;
              margin-top: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Hey ${name},</h2>
            <p>${message}</p>
            <a href="${link}" class="button">View Order</a>
          </div>
        </body>
      </html>
    `;
  }
  