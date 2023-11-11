import { createHash } from 'node:crypto'
import { exec } from 'node:child_process'
import jwt from 'jsonwebtoken'
import ldapjs from 'ldapjs'
import mongoose from 'mongoose'
import { sha512Crypt, verifySha512 } from 'ldap-sha512'

const { verify: jwtVerify, sign: jwtSign } = jwt
const { Change: LdapChange } = ldapjs
const { Schema } = mongoose

export {
	jwtVerify,
	jwtSign,
	ldapjs,
	LdapChange,
	mongoose,
	Schema,
	sha512Crypt,
	verifySha512,
	createHash,
	exec,
}
