import jwt from 'jsonwebtoken'
import ldapjs from 'ldapjs'
import mongoose from 'mongoose'
import {sha512Crypt, verifySha512} from 'ldap-sha512'
import {createHash} from 'crypto'
import {exec} from 'node:child_process'

const {verify: jwtVerify, sign: jwtSign} = jwt
const {Change: ldapChange} = ldapjs
const {Schema} = mongoose

export {
	jwtVerify,
	jwtSign,
	ldapjs,
	ldapChange,
	mongoose,
	Schema,
	sha512Crypt,
	verifySha512,
	createHash,
	exec
}
