import { CreatePassword } from "@/src/modules/user/views/create-password";
import { LinkExpired } from "@/src/modules/user/views/link-expired";
import { api_url } from "@/utils/auth";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function CreatePasswordLayout() {
    const router = useRouter();
    const [valid, setValid] = useState(true)
    const [email, setEmail] = useState("")
	const { tok } = router.query;
    const getToken = async () => {
		await axios
			.patch(
				`${api_url}/api/auth/reset-verify`,
				{
					token: String(tok),
				},
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			)
            .then((res) => {
                setValid(true)
                setEmail(res?.data?.email)
			})
            .catch((err) => {
                setValid(false)
			});
	};
	useEffect(() => {
		getToken();
	}, []);
    return (
        <div>{tok && valid ? <CreatePassword mail={email} token={String(tok)} /> : <LinkExpired />}</div>
    );
}
