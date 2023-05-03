import { harperClient } from "../harperdb";
export function HarperDBAdapter() {
    return {
        async workerLog(path, from, response) {
            const schema = {
                path: path,
                from: from,
                response: response
            }
            const result = await harperClient({
                operation: 'insert',
                schema: 'Fessment',
                table: 'Log',
                records: [schema]
            });
            return result
        },
        async findRunLogByDMID(id) {
            const run = await harperClient({
                operation: 'sql',
                sql: `SELECT * FROM TwitterAccounts.Runs WHERE dm_id = "${id}"`
            });
            return run
        },
        async findRunLogTwitterID(id) {
            const run = await harperClient({
                operation: 'sql',
                sql: `SELECT * FROM TwitterAccounts.Runs WHERE twitter = "${id}"`
            });
            return run
        },
        async addRunLog(id, from_id, message, tweet_id, dm_id, status) {
            const run = {
                twitter_id: parseInt(id),
                from_id: parseInt(from_id),
                message: message,
                tweet_id: parseInt(tweet_id),
                dm_id: parseInt(dm_id),
                status: status
            }
            const result = await harperClient({
                operation: 'insert',
                schema: 'TwitterAccounts',
                table: 'Runs',
                records: [run]
            });

            if (result.error) {
                console.log(`Failed to create log: ${result.error}`);
                throw new Error('Failed to create log');
            }
        },
        async updateAccounts(id, token) {
            const accounts = await harperClient({
                operation: 'sql',
                sql: `SELECT * FROM TwitterAccounts.Accounts WHERE id = "${id}"`
            });
            accounts[0].refresh_token = token.refresh_token
            accounts[0].access_token = token.access_token

            const update = await harperClient({
                operation: 'update',
                schema: 'TwitterAccounts',
                table: 'Accounts',
                records: [accounts[0]]
            });
            if (update.error) {
                return {
                    success: false,
                    message: update.error
                }
            }
            return {
                success: true
            }
        },
        async changeTrigger(id, key, time) {
            const accounts = await harperClient({
                operation: 'sql',
                sql: `SELECT * FROM TwitterAccounts.Accounts WHERE id = "${id}"`
            });
            accounts[0].triggerKey = key
            accounts[0].triggerTime = time
            const update = await harperClient({
                operation: 'update',
                schema: 'TwitterAccounts',
                table: 'Accounts',
                records: [accounts[0]]
            });
            if (update.error) {
                console.log(update.error)
            }
            return update;
        },
        async getTwitterAccountsByEmail(email) {
            const accounts = await harperClient({
                operation: 'sql',
                sql: `SELECT * FROM TwitterAccounts.Accounts WHERE owner_email = "${email}"`
            });
            return accounts;
        },
        async getTwitterAccountsByTwitterId(id) {
            const accounts = await harperClient({
                operation: 'sql',
                sql: `SELECT * FROM TwitterAccounts.Accounts WHERE twitter_id="${id}"`
            });
            return accounts;
        },
        async getTwitterAccountsById(id) {
            const accounts = await harperClient({
                operation: 'sql',
                sql: `SELECT * FROM TwitterAccounts.Accounts WHERE id="${id}"`
            });
            return accounts;
        },
        async getTwitterAccounts() {
            const accounts = await harperClient({
                operation: 'sql',
                sql: `SELECT * FROM TwitterAccounts.Accounts`
            });
            return accounts;
        },
        async deleteTwitterAccounts(id) {
            const accounts = await harperClient({
                operation: 'sql',
                sql: `SELECT * FROM TwitterAccounts.Accounts WHERE id="${id}"`
            });
            let delTwitter = await harperClient({
                operation: 'delete',
                schema: 'TwitterAccounts',
                table: 'Accounts',
                hash_values: [accounts[0].id]
            });
            if (delTwitter.error) {
                console.log(delTwitter.error)
                return {
                    success: false,
                    message: delTwitter.error
                }
            } else {
                return {
                    success: true
                }
            }

        },
        async addTwitterAccounts(twitterOAuth, profile, email) {
            const accountConstructor = {
                owner_email: email,
                username: profile.username,
                name: profile.name,
                image: profile.profile_image_url,
                token_type: twitterOAuth.token_type,
                access_token: twitterOAuth.access_token,
                expires_in: twitterOAuth.expires_in,
                refresh_token: twitterOAuth.refresh_token,
                triggerKey: "fm!",
                triggerTime: "15",
                twitter_id: parseInt(profile.id),
            }
            const existingTwitter = await harperClient({
                operation: 'sql',
                sql: `SELECT * FROM TwitterAccounts.Accounts WHERE twitter_id="${profile.id}"`
            })
            if (existingTwitter && existingTwitter[0]) {
                if (existingTwitter[0].owner_email == email) {
                    accountConstructor.owner_email = existingTwitter[0].owner_email;
                    accountConstructor.triggerKey = existingTwitter[0].triggerKey;
                    accountConstructor.triggerTime = existingTwitter[0].triggerTime;
                    accountConstructor.id = existingTwitter[0].id
                    console.log("update")
                    const update = await harperClient({
                        operation: 'update',
                        schema: 'TwitterAccounts',
                        table: 'Accounts',
                        records: [accountConstructor]
                    });
                    if (update.error) {
                        console.log(`[Add Twitter] Failed to update accounts: ${update.error}`);
                        return {
                            success: false,
                            message: update.error
                        }
                    }

                }
                console.log("lewat")
                return {
                    success: false,
                    message: "Twitter account exists."
                }
            }
            const insert = await harperClient({
                operation: 'insert',
                schema: 'TwitterAccounts',
                table: 'Accounts',
                records: [accountConstructor]
            })
            if (insert.error) {
                console.log(`[Add Twitter] Failed to add accounts: ${insert.error}`);
                return {
                    success: false,
                    message: "Failed to add twitter account"
                }
            }
            return {
                success: true,
                message: "Successfully add twitter account"
            }
        },
        async createUser(user) {
            const existing = await harperClient({
                operation: 'sql',
                sql: `SELECT * FROM Auth.Users WHERE email = "${user.email}"`
            });

            if (existing && existing[0]) return existing[0];

            const result = await harperClient({
                operation: 'insert',
                schema: 'Auth',
                table: 'Users',
                records: [user]
            });

            if (result.error) {
                console.log(`Failed to create User: ${result.error}`);
                throw new Error('Failed to create User');
            }

            return {
                ...user,
                id: result.inserted_hashes[0]
            };
        },
        async getUser(id) {
            const user = await harperClient({
                operation: 'sql',
                sql: `SELECT * FROM Auth.Users WHERE id = "${id}"`
            });
            return user && user[0];
        },
        async getUserByEmail(email) {
            const user = await harperClient({
                operation: 'sql',
                sql: `SELECT * FROM Auth.Users WHERE email = "${email}"`
            });
            return user && user[0];
        },
        async getUserByAccount({ providerAccountId, provider }) {
            const account = await harperClient({
                operation: 'sql',
                sql: `SELECT * FROM Auth.Accounts WHERE provider = "${provider}" AND providerAccountId = "${providerAccountId}"`
            });

            if (!account || !account[0]) return;

            const user = await harperClient({
                operation: 'sql',
                sql: `SELECT * FROM Auth.Users WHERE id = "${account[0].userId}"`
            });

            return user && user[0];
        },
        async updateUser(updatedUser) {
            const existing = await harperClient({
                operation: 'sql',
                sql: `SELECT * FROM Auth.Users WHERE id = "${updatedUser.id}"`
            });

            if (!existing || !existing[0]) {
                throw new Error(`Can not update user ${updatedUser.id}; Unable to find user.`);
            }

            const user = {
                ...existing[0],
                ...updatedUser
            }

            const result = await harperClient({
                operation: 'update',
                schema: 'Auth',
                table: 'Users',
                hash_values: [user]
            });

            return user;
        },
        async linkAccount(account) {
            await harperClient({
                operation: 'insert',
                schema: 'Auth',
                table: 'Accounts',
                records: [account]
            });
            return account;
        },
        async createSession(session) {
            await harperClient({
                operation: 'insert',
                schema: 'Auth',
                table: 'Sessions',
                records: [session]
            });
            return session;
        },
        async getSessionAndUser(sessionToken) {
            const session = await harperClient({
                operation: 'sql',
                sql: `SELECT * FROM Auth.Sessions WHERE sessionToken = "${sessionToken}"`
            });

            if (!session || !session[0]) return;

            const user = await harperClient({
                operation: 'sql',
                sql: `SELECT * FROM Auth.Users WHERE id = "${session[0]?.userId}"`
            });

            if (!user || !user[0]) return;

            return { session: session[0], user: user[0] };
        },
        async updateSession(session) {
            const existing = await harperClient({
                operation: 'sql',
                sql: `SELECT * FROM Auth.Sessions WHERE sessionToken = "${session.sessionToken}"`
            });

            if (!existing || !existing[0]) {
                throw new Error(`Can not update sessesion ${sessionToken}; Unable to find session.`)
            };

            const result = await harperClient({
                operation: 'update',
                schema: 'Auth',
                table: 'Sessions',
                hash_values: [{
                    id: existing.id,
                    ...session
                }]
            });

            return session;
        },
        async deleteSession(sessionToken) {
            const existing = await harperClient({
                operation: 'sql',
                sql: `SELECT * FROM Auth.Sessions WHERE sessionToken = "${sessionToken}"`
            });

            await harperClient({
                operation: 'delete',
                schema: 'Auth',
                table: 'Sessions',
                hash_values: [existing.id]
            });
        },
    }
}