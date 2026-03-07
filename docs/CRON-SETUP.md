# 🤖 Automatic Daily Job Import Setup

This guide shows you how to set up automatic daily job imports from RemoteOK.

## 🎯 What It Does

- **Daily Import**: Fetches jobs from RemoteOK every day at 9:00 AM UTC
- **Visa Sponsorship Filter**: Only imports jobs with visa sponsorship/relocation support
- **Auto Company Creation**: Creates companies automatically if they don't exist
- **Duplicate Prevention**: Skips jobs that already exist
- **Weekly Cleanup**: Removes jobs older than 30 days (Sundays)

## 🚀 Setup Options

### Option 1: Cron-Job.org (Recommended - Free)

1. **Go to**: https://console.cron-job.org/
2. **Create account** and login
3. **Click "Create cronjob"**
4. **Configure**:
   - **Title**: `VizzarJobs Daily Import`
   - **URL**: `https://your-domain.com/api/cron/daily-import`
   - **Method**: `POST`
   - **Schedule**: `0 9 * * *` (9 AM UTC daily)
   - **Headers**: 
     ```
     Content-Type: application/json
     Authorization: Bearer YOUR_SECRET_KEY
     ```
5. **Save** the cron job

### Option 2: GitHub Actions (Free)

Create `.github/workflows/daily-import.yml`:

```yaml
name: Daily Job Import

on:
  schedule:
    - cron: '0 9 * * *'  # 9 AM UTC daily
  workflow_dispatch:  # Manual trigger

jobs:
  import:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Daily Import
        run: |
          curl -X POST https://your-domain.com/api/cron/daily-import \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```

### Option 3: Vercel Cron (If using Vercel)

Add to `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/daily-import",
      "schedule": "0 9 * * *"
    }
  ]
}
```

### Option 4: Railway Cron (If using Railway)

Add to `railway.toml`:

```toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "npm start"

[cron]
daily-import = "0 9 * * *"
```

## 🔐 Security Setup

Add to your `.env` file:

```env
CRON_SECRET=your-super-secret-key-here
```

## 🧪 Testing

### Test the Import Endpoint

```bash
# Test the daily import
curl -X POST https://your-domain.com/api/cron/daily-import \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-secret-key"

# Test without auth (for development)
curl -X POST http://localhost:3000/api/cron/test-import
```

### Test in Admin Panel

1. Go to `/admin/import-jobs`
2. Click "Test Import Now"
3. Check the results

## 📊 Monitoring

### Check Import Status

- **Admin Panel**: `/admin/import-jobs` shows import status
- **Logs**: Check your deployment logs for import results
- **Database**: Check the `Job` table for new entries

### Expected Results

- **Daily**: ~35 jobs imported from RemoteOK
- **Weekly**: Old jobs cleaned up (Sundays)
- **Companies**: Auto-created as needed
- **Duplicates**: Automatically skipped

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection**: Make sure your database is accessible
2. **API Rate Limits**: RemoteOK has no rate limits, but be respectful
3. **Cron Service**: Check if your cron service is working
4. **Authentication**: Verify the CRON_SECRET matches

### Debug Steps

1. **Test manually**: Use the "Test Import Now" button
2. **Check logs**: Look for import success/failure messages
3. **Verify endpoint**: Test the API endpoint directly
4. **Check database**: Ensure jobs are being created

## 📈 Scaling

### Add More Sources

To add more job sources:

1. **Create new importer** in `src/lib/job-import/`
2. **Add to daily import** in `src/lib/cron/daily-job-import.ts`
3. **Update admin UI** to show new sources

### Increase Frequency

Change the cron schedule:
- **Every 6 hours**: `0 */6 * * *`
- **Every 12 hours**: `0 */12 * * *`
- **Twice daily**: `0 9,21 * * *`

## 🎉 Success!

Once set up, your job board will automatically:
- ✅ Import fresh jobs daily
- ✅ Filter for visa sponsorship
- ✅ Create companies automatically
- ✅ Prevent duplicates
- ✅ Clean up old jobs
- ✅ Run without manual intervention

**Your job board is now fully automated!** 🚀


