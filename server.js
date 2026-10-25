const express = require("express");
const path = require("path");
const bcrypt = require("bcryptjs");
const session = require("express-session");

const db = require("./config/db");

const app = express();

const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
    session({
        secret: "smart-village-secret-key",
        resave: false,
        saveUninitialized: false
    })
);

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Home
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Register page
app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "register.html"));
});

// Login page
app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "login.html"));
});

// Dashboard
app.get("/dashboard", (req, res) => {

    if (!req.session.user) {
        return res.redirect("/login");
    }

    res.sendFile(path.join(__dirname, "views", "dashboard.html"));
});

// ===============================
// JOBS PAGE
// ===============================

app.get("/jobs", (req, res) => {

    if (!req.session.user) {
        return res.redirect("/login");
    }

    res.send(`
        <!DOCTYPE html>
        <html lang="en">

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">

            <title>Jobs - Smart Village</title>

            <link rel="stylesheet" href="/css/style.css">
        </head>

        <body>

            <nav>

                <div class="logo">
                    Smart Village
                </div>

                <div>
                    <a href="/dashboard">Dashboard</a>
                    <a href="/logout">Logout</a>
                </div>

            </nav>

            <section class="hero">

                <h1>💼 Job Opportunities</h1>

                <p>
                    Find employment opportunities
                    based on your skills.
                </p>

            </section>

            <section class="features">

                <div class="card">
                    <h2>💻 Computer Assistant</h2>
                    <p>
                        Entry-level computer and
                        digital support opportunities.
                    </p>
                </div>

                <div class="card">
                    <h2>🌾 Agriculture Worker</h2>
                    <p>
                        Employment opportunities in
                        agriculture and farming.
                    </p>
                </div>

                <div class="card">
                    <h2>🛍️ Retail Assistant</h2>
                    <p>
                        Local shop and customer
                        support opportunities.
                    </p>
                </div>

                <div class="card">
                    <h2>🔧 Skilled Worker</h2>
                    <p>
                        Opportunities for people with
                        technical and practical skills.
                    </p>
                </div>

            </section>

        </body>
        </html>
    `);
});

// ===============================
// SKILL DEVELOPMENT PAGE
// ===============================

app.get("/skills", (req, res) => {

    if (!req.session.user) {
        return res.redirect("/login");
    }

    res.send(`
        <!DOCTYPE html>
        <html lang="en">

        <head>

            <meta charset="UTF-8">

            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
            >

            <title>Skill Development - Smart Village</title>

            <link rel="stylesheet" href="/css/style.css">

        </head>

        <body>

            <nav>

                <div class="logo">
                    Smart Village
                </div>

                <div>
                    <a href="/dashboard">Dashboard</a>
                    <a href="/logout">Logout</a>
                </div>

            </nav>


            <section class="hero">

                <h1>🎓 Skill Development</h1>

                <p>
                    Discover training programs
                    to improve your skills.
                </p>

            </section>


            <section class="features">


                <div class="card">

                    <h2>💻 Digital Skills</h2>

                    <p>
                        Learn basic computer,
                        internet and digital skills.
                    </p>

                </div>


                <div class="card">

                    <h2>🌾 Agricultural Skills</h2>

                    <p>
                        Learn modern farming and
                        sustainable agriculture practices.
                    </p>

                </div>


                <div class="card">

                    <h2>🔧 Technical Skills</h2>

                    <p>
                        Develop practical technical
                        and vocational skills.
                    </p>

                </div>


                <div class="card">

                    <h2>🧵 Entrepreneurship Skills</h2>

                    <p>
                        Learn skills for starting and
                        managing a small business.
                    </p>

                </div>


            </section>

        </body>

        </html>
    `);
});
// Government Schemes
app.get("/schemes", (req, res) => {

    if (!req.session.user) {
        return res.redirect("/login");
    }

    res.sendFile(
        path.join(__dirname, "views", "schemes.html")
    );

});
// Smart Agriculture
app.get("/agriculture", (req, res) => {

    if (!req.session.user) {
        return res.redirect("/login");
    }

    res.sendFile(
        path.join(__dirname, "views", "agriculture.html")
    );

});
// Market Opportunities
app.get("/market", (req, res) => {

    if (!req.session.user) {
        return res.redirect("/login");
    }

    res.sendFile(
        path.join(__dirname, "views", "market.html")
    );

});
// AI Recommendations
app.get("/recommendations", (req, res) => {

    if (!req.session.user) {
        return res.redirect("/login");
    }

    res.sendFile(
        path.join(__dirname, "views", "recommendations.html")
    );

});
// Profile page
app.get("/profile", (req, res) => {

    if (!req.session.user) {
        return res.redirect("/login");
    }

    res.sendFile(
        path.join(__dirname, "views", "profile.html")
    );

});
// Update user profile
app.post("/profile", (req, res) => {

    if (!req.session.user) {
        return res.redirect("/login");
    }

    const {
        name,
        phone,
        email,
        age,
        education,
        skills,
        occupation,
        income_category,
        employment_status
    } = req.body;

    const sql = `
        UPDATE users
        SET
            name = ?,
            phone = ?,
            email = ?,
            age = ?,
            education = ?,
            skills = ?,
            occupation = ?,
            income_category = ?,
            employment_status = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            name,
            phone,
            email,
            age || null,
            education || null,
            skills || null,
            occupation || null,
            income_category || null,
            employment_status || null,
            req.session.user.id
        ],
        (err) => {

            if (err) {
                console.log(err);
                return res.send(`
                    <h2>Profile update failed.</h2>
                    <a href="/profile">Go back to Profile</a>
                `);
            }

            req.session.user.name = name;
            req.session.user.email = email;

            res.send(`
                <h2>Profile updated successfully!</h2>
                <a href="/profile">Go back to Profile</a>
            `);

        }
    );

});

// ===============================
// REGISTER USER
// ===============================

app.post("/register", async (req, res) => {

    const {
        name,
        age,
        education,
        skills,
        occupation,
        income_category,
        employment_status,
        email,
        password
    } = req.body;

    try {

        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `
            INSERT INTO users
            (
                name,
                age,
                education,
                skills,
                occupation,
                income_category,
                employment_status,
                email,
                password
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(
            sql,
            [
                name,
                age,
                education,
                skills,
                occupation,
                income_category,
                employment_status,
                email,
                hashedPassword
            ],
            (err) => {

                if (err) {

                    if (err.code === "ER_DUP_ENTRY") {
                        return res.send(`
                            <h2>Email already registered</h2>
                            <a href="/login">Go to Login</a>
                        `);
                    }

                    console.log(err);
                    return res.send("Registration failed.");
                }

                res.redirect("/login");
            }
        );

    } catch (error) {

        console.log(error);
        res.send("Registration failed.");
    }
});

// ===============================
// LOGIN
// ===============================

app.post("/login", (req, res) => {

    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], async (err, results) => {

        if (err) {
            console.log(err);
            return res.send("Login failed.");
        }

        if (results.length === 0) {
            return res.send(`
                <h2>Invalid email or password</h2>
                <a href="/login">Try again</a>
            `);
        }

        const user = results[0];

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.send(`
                <h2>Invalid email or password</h2>
                <a href="/login">Try again</a>
            `);
        }

        req.session.user = {
            id: user.id,
            name: user.name,
            email: user.email
        };

        res.redirect("/dashboard");
    });
});

// ===============================
// LOGOUT
// ===============================

app.get("/logout", (req, res) => {

    req.session.destroy(() => {
        res.redirect("/");
    });

});

// ===============================
// START SERVER
// ===============================

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});