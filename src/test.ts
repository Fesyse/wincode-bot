import { hash } from "argon2"

async function main() {
  console.log(await hash("yayca"))
}

main()
