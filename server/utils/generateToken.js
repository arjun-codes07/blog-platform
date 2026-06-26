import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },                    // payload — data stored in token
    process.env.JWT_SECRET,            // secret key to sign the token
    { expiresIn: '7d' }               // token expires in 7 days
  );
};

export default generateToken;