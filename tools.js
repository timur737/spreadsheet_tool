require('dotenv').config();
const express = require('express');
const { google } = require('googleapis');
const router = express.Router();

// Configure Google Sheets
const auth = new google.auth.GoogleAuth({
    keyFile: 'credentials_google.json',
    scopes: 'https://www.googleapis.com/auth/spreadsheets',
});

const spreadsheetId = process.env.SPREADSHEET_ID;
const sheetName = 'ConversationSummaries';

// Ultravox Tool Handler
router.post('/saveSummary', async (req, res) => {
    try {
        const { conversationSummary } = req.body;

        // Validate input
        if (!conversationSummary || typeof conversationSummary !== 'string') {
            return res.status(400).json({
                message: 'Invalid conversation summary provided'
            });
        }

        // Append to Google Sheet
        const sheets = google.sheets({ version: 'v4', auth });
        const response = await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: `${sheetName}!A:B`,
            valueInputOption: 'RAW',
            requestBody: {
                values: [[
                    new Date().toISOString(), // Timestamp
                    conversationSummary
                ]]
            }
        });

        return res.status(200).json({
            message: 'Summary saved successfully. You can conclude the conversation.',
            data: response.data
        });

    } catch (error) {
        console.error('Error saving summary:', error);
        return res.status(500).json({
            message: 'Failed to save conversation summary',
            error: error.message
        });
    }
});


router.get("/health", (req, res) => {
    return res.status(200).json({
        message: 'Bot is healthy',
        data: {}
    });
});

module.exports = router;