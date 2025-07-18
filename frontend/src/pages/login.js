import ApplicationLogo from '@/components/ApplicationLogo'
import AuthCard from '@/components/AuthCard'
import AuthSessionStatus from '@/components/AuthSessionStatus'
import Button from '@/components/Button'
import GuestLayout from '@/components/Layouts/GuestLayout'
import Input from '@/components/Input'
import InputError from '@/components/InputError'
import Label from '@/components/Label'
import Link from 'next/link'
import { useAuth } from '@/hooks/auth'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import MovieFilterIcon from '@mui/icons-material/MovieFilter'

const Login = () => {
    const router = useRouter()

    const { login } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/dashboard',
    })

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [shouldRemember, setShouldRemember] = useState(false)
    const [errors, setErrors] = useState([])
    const [status, setStatus] = useState(null)

    useEffect(() => {
        if (router.query.reset?.length > 0 && errors.length === 0) {
            setStatus(atob(router.query.reset))
        } else {
            setStatus(null)
        }
    })

    const submitForm = async event => {
        event.preventDefault()

        login({
            email,
            password,
            remember: shouldRemember,
            setErrors,
            setStatus,
        })
    }

        return (
        <GuestLayout>
            <AuthCard
            logo={
                <Link href="/">
                <ApplicationLogo style={{ fontSize: 80, color: '#4b5563' }} />
                </Link>
            }
            >
            {/* ステータスメッセージ */}
            <AuthSessionStatus className="mb-4" status={status} />

            <form onSubmit={submitForm}>
                {/* メールアドレス */}
                <div>
                <Label htmlFor="email">メールアドレス</Label>

                <Input
                    id="email"
                    type="email"
                    value={email}
                    className="block mt-1 w-full"
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    autoFocus
                />

                <InputError messages={errors.email} className="mt-2" />
                </div>

                {/* パスワード */}
                <div className="mt-4">
                <Label htmlFor="password">パスワード</Label>

                <Input
                    id="password"
                    type="password"
                    value={password}
                    className="block mt-1 w-full"
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    autoComplete="current-password"
                />

                <InputError messages={errors.password} className="mt-2" />
                </div>

                {/* ログイン情報を記憶 */}
                <div className="block mt-4">
                <label htmlFor="remember_me" className="inline-flex items-center">
                    <input
                    id="remember_me"
                    type="checkbox"
                    name="remember"
                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    onChange={(event) => setShouldRemember(event.target.checked)}
                    />
                    <span className="ml-2 text-sm text-gray-600">ログイン情報を記憶する</span>
                </label>
                </div>

                {/* パスワード再設定リンク & ログインボタン */}
                <div className="flex items-center justify-end mt-4">
                <Link href="/forgot-password" className="underline text-sm text-gray-600 hover:text-gray-900">
                    パスワードをお忘れですか？
                </Link>

                <Button className="ml-3">ログイン</Button>
                </div>
            </form>
            </AuthCard>
        </GuestLayout>

    )
}

export default Login
