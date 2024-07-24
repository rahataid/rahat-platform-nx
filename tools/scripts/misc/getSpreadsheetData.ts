import { JWT } from 'google-auth-library';
import { GoogleSpreadsheet, GoogleSpreadsheetRow } from 'google-spreadsheet';

const google_cred = require(`./config/google.json`);

const serviceAccountAuth = new JWT({
    email: google_cred.client_email,
    key: google_cred.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const getGoogleSheetsData = async (
    sheetId: string,
    sheetName: string
): Promise<GoogleSpreadsheetRow<Record<string, any>>[]> => {
    const doc = new GoogleSpreadsheet(sheetId, serviceAccountAuth);
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle[sheetName];
    const rows = await sheet.getRows();
    return rows;
};

const sheetId = '1CQjNvvEpjx9VXzUffm5UwnrWSVjpKhlhmm0snmqCm7k';
const sheetName = 'stakeholders_list';

(async () => {
    const data = await getGoogleSheetsData(sheetId, sheetName);
    const sanitizedData = data.map((row) => ({
        name: row.get('Name'),
        designation: row.get('Designation'),
        district: row.get('District'),
        mobile: row.get('Mobile'),
    }));

    console.log(sanitizedData);
})();
