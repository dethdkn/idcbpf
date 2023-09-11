export default (
	responsavel: string,
	foto: string,
	uid: string,
	nome: string,
	sobrenome: string,
	telefone: string,
	email: string,
	senha: string,
	ramal?: string,
	validade?: string,
	descricao?: string
): Promise<void> => {
	return new Promise(async (resolve, reject) => {
		const entrys: any = {
			objectClass: [
				'top',
				'person',
				'organizationalPerson',
				'inetOrgPerson',
				'posixAccount',
				'sambaSamAccount',
				'brPerson',
				'cbpfEduPersonBR',
				'eduPerson',
				'schacContactLocation',
				'schacPersonalCharacteristics',
				'shadowAccount',
				'pwdPolicy'
			],
			pwdAttribute: '2.5.4.35',
			sambaSID: 'S-1-5-21-1585490558-2998206966-4214103191-300',
			sambaPasswordHistory: '000000000000000000000000000000000000000000000000000000000',
			sambaAcctFlags: '[U',
			sambaPwdLastSet: 1263386096,
			gidNumber: 300,
			loginShell: '/bin/bash',
			uid: uid,
			uidNumber: await lastID(),
			cn: `${nome} ${sobrenome}`,
			givenName: nome,
			sn: sobrenome,
			mail: uid + '@cbpf.br',
			personalMail: email,
			mobile: telefone,
			userPassword: [
				await sha512Crypt(senha),
				'{CRYPT}$6$Fj7RRy2j$x5/7lrllfwDLlqSX0L5LgRaelVWZLJgbERsD2Xz5Vq0ykFj2EYf1d0Jto9GbwFcbax9pBCN/DKRhyB9OoIkSx1'
			],
			sambaNTPassword: sambaNTPassword(senha),
			userResponsible: responsavel,
			homeDirectory: `/home/delta/${uid}`,
			description: descricao || '-',
			lastModifiedBy: responsavel || '',
			timeStamp: new Date()
		}
		if (ramal) entrys.telephoneNumber = ramal
		if (foto) entrys.jpegPhoto = stringToBuffer(foto)
		if (validade) {
			const partesData = `${validade}`.substring(0, 10).split('-')
			entrys.userValidity = `${partesData[0]}-${Number(partesData[1]) - 1}-${partesData[2]}`
		}
		ldapClient.add(`uid=${uid}, ${LDAP_PEOPLE_DN}`, entrys, (err) => {
			if (err) {
				new Erro({
					erro: {
						info: 'Erro ao criar usuario no ldap',
						err
					}
				}).save()
				return reject('Erro ao criar usuários')
			}
			return resolve()
		})
	})
}
