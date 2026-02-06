const { execSync } = require('child_process');

try {
    console.log('Searching for process on port 3001...');
    // Find PID using lsof or netstat
    // lsof -t -i:3001
    try {
        const pid = execSync('lsof -t -i:3001').toString().trim();
        if (pid) {
            console.log(`Found PID ${pid}. Killing it...`);
            execSync(`kill -9 ${pid}`);
            console.log('✅ Port 3001 freed.');
        } else {
            console.log('No process found on port 3001 (using lsof).');
        }
    } catch (e) {
        // Fallback to netstat/fuser if lsof fails
        console.log('lsof failed or empty. Trying fuser...');
        try {
            execSync('fuser -k 3001/tcp');
            console.log('✅ Port 3001 freed (via fuser).');
        } catch (e2) {
            console.log('Could not kill via fuser either. Trying dangerous killall node...');
            // Don't actually do killall node automatically, it's too dangerous.
            console.log('⚠️ Manual intervention required: Run "killall node" if safe, or find the PID manually.');
        }
    }
} catch (error) {
    console.error('Error:', error.message);
}
