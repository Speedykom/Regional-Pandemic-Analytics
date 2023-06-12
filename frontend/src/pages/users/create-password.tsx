import { CreatePassword } from "@/modules/user/views/create-password";
import { LinkExpired } from "@/modules/user/views/link-expired";
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
			.post(
				`${process.env.NEXT_PUBLIC_BASE_URL}/api/account/verify-token`,
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
