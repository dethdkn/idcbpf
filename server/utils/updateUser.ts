export default (
	responsavel: string,
	oldUID: UID,
	uid: string,
	foto: string,
	nome: string,
	sobrenome: string,
	telefone: string,
	email: string,
	senha?: string,
	ramal?: string,
	validade?: string,
	descricao?: string
): Promise<void> => {
	return new Promise(async (resolve, reject) => {
		const changes: LdapChange[] = []
		if (oldUID.jpegPhoto !== foto) {
			changes.push(
				new ldapChange({
					operation: 'replace',
					modification: {
						type: 'jpegPhoto',
						values: [stringToBuffer(foto)]
					}
				})
			)
			new Log({
				usuario: responsavel,
				acao: `Editou a foto do usuário '${uid}'`
			}).save()
		}
		if (oldUID.givenName !== nome) {
			changes.push(
				new ldapChange({
					operation: 'replace',
					modification: {
						type: 'givenName',
						values: [nome]
					}
				})
			)
			new Log({
				usuario: responsavel,
				acao: `Editou o nome do usuário '${uid}' -> de '${oldUID.givenName}' para '${nome}'`
			}).save()
		}
		if (oldUID.sn !== sobrenome) {
			changes.push(
				new ldapChange({
					operation: 'replace',
					modification: {
						type: 'sn',
						values: [sobrenome]
					}
				})
			)
			new Log({
				usuario: responsavel,
				acao: `Editou o sobrenome do usuário '${uid}' -> de '${oldUID.sn}' para '${sobrenome}'`
			}).save()
		}
		if ((oldUID.givenName !== nome || oldUID.sn) !== sobrenome) {
			changes.push(
				new ldapChange({
					operation: 'replace',
					modification: {
						type: 'cn',
						values: [`${nome} ${sobrenome}`]
					}
				})
			)
			new Log({
				usuario: responsavel,
				acao: `Editou o nome completo do usuário '${uid}' -> de '${oldUID.givenName} ${oldUID.sn}' para '${nome} ${sobrenome}'`
			}).save()
		}
		if (oldUID.mobile !== telefone) {
			changes.push(
				new ldapChange({
					operation: 'replace',
					modification: {
						type: 'mobile',
						values: [telefone]
					}
				})
			)
			new Log({
				usuario: responsavel,
				acao: `Editou o telefone do usuário '${uid}' -> de '${oldUID.mobile}' para '${telefone}'`
			}).save()
		}
		if (oldUID.personalMail !== email) {
			changes.push(
				new ldapChange({
					operation: 'replace',
					modification: {
						type: 'personalMail',
						values: [email]
					}
				})
			)
			new Log({
				usuario: responsavel,
				acao: `Editou o email pessoal do usuário '${uid}' -> de '${oldUID.personalMail}' para '${email}'`
			}).save()
		}
		if (senha) {
			changes.push(
				new ldapChange({
					operation: 'replace',
					modification: {
						type: 'userPassword',
						values: [
							await sha512Crypt(senha),
							'{CRYPT}$6$Fj7RRy2j$x5/7lrllfwDLlqSX0L5LgRaelVWZLJgbERsD2Xz5Vq0ykFj2EYf1d0Jto9GbwFcbax9pBCN/DKRhyB9OoIkSx1'
						]
					}
				})
			)
			changes.push(
				new ldapChange({
					operation: 'replace',
					modification: {
						type: 'sambaNTPassword',
						values: [sambaNTPassword(senha)]
					}
				})
			)
			new Log({
				usuario: responsavel,
				acao: `Editou a senha do usuário '${uid}'`
			}).save()
		}
		if (ramal) {
			changes.push(
				new ldapChange({
					operation: 'replace',
					modification: {
						type: 'telephoneNumber',
						values: [ramal]
					}
				})
			)
		} else {
			if (oldUID.telephoneNumber)
				changes.push(
					new ldapChange({
						operation: 'delete',
						modification: {
							type: 'telephoneNumber',
							values: [oldUID.telephoneNumber]
						}
					})
				)
		}
		if (descricao) {
			changes.push(
				new ldapChange({
					operation: 'replace',
					modification: {
						type: 'description',
						values: [descricao]
					}
				})
			)
		} else {
			changes.push(
				new ldapChange({
					operation: 'replace',
					modification: {
						type: 'description',
						values: ['-']
					}
				})
			)
		}
		if (validade) {
			const partesData = `${validade}`.substring(0, 10).split('-')
			changes.push(
				new ldapChange({
					operation: 'replace',
					modification: {
						type: 'userValidity',
						values: [`${partesData[0]}-${Number(partesData[1]) - 1}-${partesData[2]}`]
					}
				})
			)
		} else {
			if (oldUID.userValidity)
				changes.push(
					new ldapChange({
						operation: 'delete',
						modification: {
							type: 'userValidity',
							values: [oldUID.userValidity]
						}
					})
				)
		}
		changes.push(
			new ldapChange({
				operation: 'replace',
				modification: {
					type: 'lastModifiedBy',
					values: [responsavel]
				}
			})
		)
		changes.push(
			new ldapChange({
				operation: 'replace',
				modification: {
					type: 'timeStamp',
					values: [`${new Date()}`]
				}
			})
		)
		ldapClient.modify(`uid=${uid}, ${LDAP_PEOPLE_DN}`, changes, (err) => {
			if (err) {
				new Erro({
					erro: {
						info: 'Erro ao atualizar usuario no ldap',
						err
					}
				}).save()
				return reject('Erro ao atualizar usuário')
			}
			return resolve()
		})
	})
}
