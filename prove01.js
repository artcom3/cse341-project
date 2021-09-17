const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {

    const url = req.url;
    const method = req.method;
    if (url === '/') {
        res.setHeader('Content-Type', 'text/html');
        res.write('<html>');
        res.write('<head><title>Prove 01</title></head>');
        res.write('<body>');
        res.write('<h1>Create User</h1>');
        res.write('<form action="/create-user" method="POST"><input type="text" name="username"><button type="submit">Send</button></form>');
        res.write('<a href="/users">View Users</a>');
        res.write('</body>');
        res.write('</html>');
        res.end();
        return res.end();
    }
    if (url === '/users') {
        let users;
        if (fs.existsSync('users.txt')) {
            const data = fs.readFileSync('users.txt', {encoding:'utf8', flag:'r'})
            users = JSON.parse(data);
        } else {
            users = [];
        }

        res.setHeader('Content-Type', 'text/html');
        res.write('<html>');
        res.write('<head><title>Prove 01</title></head>');
        res.write('<body>');
        res.write('<h1>Users</h1>');
        res.write('<ul>');
        users.forEach(user => {
            res.write('<li>' + user + '</li>')
        });
        res.write('</ul>');
        res.write('<a href="/">Return</a>');
        res.write('</body>');
        res.write('</html>');
        res.end();
        return res.end();
    }
    if (url === '/create-user' && method === 'POST') {
        const body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        });
        return req.on('end', () => {
            
            let users;

            if (fs.existsSync('users.txt')) {
                const data = fs.readFileSync('users.txt', {encoding:'utf8', flag:'r'})
                users = JSON.parse(data);
            } else {
                users = [];
            }
            
            const parsedBody = Buffer.concat(body).toString();
            console.log(parsedBody);
            
            const user = parsedBody.split('=')[1];
            users.push(user);

            fs.writeFile('users.txt', JSON.stringify(users), err => {
                res.statusCode = 302;
                res.setHeader('Location', '/');
                return res.end();
            });

        });
    }
});

server.listen(3000);