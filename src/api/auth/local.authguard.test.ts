import * as local_authguard from "./local.authguard"
// @ponicode
describe("canActivate", () => {
    let inst: any

    beforeEach(() => {
        inst = new local_authguard.LocalAuthGuard()
    })

    test("0", async () => {
        await inst.canActivate(undefined)
    })
})
