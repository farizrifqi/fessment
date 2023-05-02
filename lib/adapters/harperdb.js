import { harperClient } from "../harperdb";
export function HarperDBAdapter() {
    return {
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
                trigger: "fm!",
                twitter_id: parseInt(profile.id),
            }
            const existingTwitter = await harperClient({
                operation: 'sql',
                sql: `SELECT * FROM TwitterAccounts.Accounts WHERE twitter_id="${profile.id}"`
            })
            if (existingTwitter && existingTwitter[0]) {
                if (existingTwitter[0].owner_email == email) {
                    accountConstructor.owner_email = existingTwitter[0].owner_email;
                    accountConstructor.trigger = existingTwitter[0].trigger;
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