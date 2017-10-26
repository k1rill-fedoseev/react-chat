class MyError extends Error {
}
class NotFoundError extends MyError {
}
class WrongAuthData extends MyError {
}
class MemberError extends MyError {
}
class CheckError extends MyError {
}

module.exports = {
    MyError,
    NotFoundError,
    WrongAuthData,
    MemberError,
    CheckError
}