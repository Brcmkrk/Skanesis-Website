import bcrypt

password = "Enesadminsifresi01234."
hashed_password = bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")
print(hashed_password)
