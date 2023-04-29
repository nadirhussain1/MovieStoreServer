import sqlite from 'sqlite3';
const db = new sqlite.Database('./movie.db');

export async function getAll(userId) {
    return new Promise((resolve, reject) => {

        const query = `SELECT * FROM Movies WHERE user = ? OR public = 1`;

        db.all(query,[userId], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

export async function remove(id,userId) {
    return new Promise((resolve, reject) => {
        const query = 'DELETE FROM Movies WHERE id = ? AND (user = ? OR public = 1)'; 
        db.run(query, [id,userId], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

export  async function get(id,userId) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM Movies WHERE id = ? AND (user = ? OR public = 1)';
        db.get(query, [id,userId], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}



function insert(movie,userId) {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO Movies (title, year,public, user) VALUES (?, ?,?,?)';
        db.run(query, [movie.title, movie.year,movie.public, userId], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

function update(movie,userId) {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE Movies SET title = ?, year = ?, public = ? , user=? WHERE id = ?';
        db.run(query, [movie.title, movie.year,movie.public, userId, movie.id], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

export async function save(movie,userId) {
    if (!movie.id) {
        insert(movie,userId);
    } else {
        update(movie,userId);
    }
}

export async function rate(rating) {
    const deleteQuery = 'DELETE FROM Ratings WHERE movie = ? AND user = ?';
    await db.run(deleteQuery, [rating.movie, rating.user]);
    const insertQuery =
    'INSERT INTO Ratings (movie, user, rating) VALUES (?, ?, ?)';
    return db.run(insertQuery, [rating.movie, rating.user, rating.rating]);
}
    

