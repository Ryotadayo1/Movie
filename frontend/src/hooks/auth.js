// frontend/src/hooks/auth.js

import useSWR from 'swr'
import axios from '@/lib/axios'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export const useAuth = ({ middleware, redirectIfAuthenticated } = {}) => {
    const router = useRouter()

    const { data: user, error, mutate } = useSWR('/api/user', () =>
        axios
            .get('/api/user')
            .then(res => res.data)
            .catch(error => {
                if (!error.response || error.response.status !== 409) throw error

                router.push('/verify-email')
            }),
    )

    const csrf = async () => {
        try {
            await axios.get('/sanctum/csrf-cookie')
        } catch (error) {
            console.error('CSRF取得失敗:', error)
            throw error
        }
    }

    const register = async ({ setErrors, ...props }) => {
        await csrf()

        setErrors([])

        try {
            await axios.post('/register', props)
            await mutate()
        } catch (error) {
            if (!error.response || error.response.status !== 422) throw error
            setErrors(error.response.data.errors)
        }
    }

    const login = async ({ setErrors, setStatus, ...props }) => {
        await csrf()

        setErrors([])
        setStatus(null)

        try {
            await axios.post('/login', props)
            await mutate()
        } catch (error) {
            if (!error.response || error.response.status !== 422) throw error
            setErrors(error.response.data.errors)
        }
    }

    const forgotPassword = async ({ setErrors, setStatus, email }) => {
        await csrf()

        setErrors([])
        setStatus(null)

        try {
            const response = await axios.post('/forgot-password', { email })
            setStatus(response.data.status)
        } catch (error) {
            if (!error.response || error.response.status !== 422) throw error
            setErrors(error.response.data.errors)
        }
    }

    const resetPassword = async ({ setErrors, setStatus, ...props }) => {
        await csrf()

        setErrors([])
        setStatus(null)

        try {
            const response = await axios.post('/reset-password', {
                token: router.query.token,
                ...props,
            })
            router.push('/login?reset=' + btoa(response.data.status))
        } catch (error) {
            if (!error.response || error.response.status !== 422) throw error
            setErrors(error.response.data.errors)
        }
    }

    const resendEmailVerification = async ({ setStatus }) => {
        try {
            const response = await axios.post('/email/verification-notification')
            setStatus(response.data.status)
        } catch (error) {
            console.error('メール確認再送失敗:', error)
        }
    }

    const logout = async () => {
        try {
            if (!error) {
                await axios.post('/logout')
                await mutate()
            }
        } finally {
            window.location.pathname = '/login'
        }
    }

    useEffect(() => {
        if (middleware === 'guest' && redirectIfAuthenticated && user)
            router.push(redirectIfAuthenticated)

        if (
            window.location.pathname === '/verify-email' &&
            user?.email_verified_at
        )
            router.push(redirectIfAuthenticated)

        if (middleware === 'auth' && error) logout()
    }, [user, error])

    return {
        user,
        register,
        login,
        forgotPassword,
        resetPassword,
        resendEmailVerification,
        logout,
    }
}
