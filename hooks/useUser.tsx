import { Subscription, UserDetails } from "@/types"
import { User } from "@supabase/auth-helpers-nextjs"
import { useSessionContext, useUser as useSupaUser } from "@supabase/auth-helpers-react"
import { createContext, useContext, useEffect, useState } from "react"

type UserContextType = {
    accessToken: string | null
    user: User | null
    userDetails: UserDetails | null
    isLoading: boolean
    subscription: Subscription | null
}

export const UserContext = createContext<UserContextType | undefined>(
    undefined
);

export interface Props {
    [propName: string]: any
}

export const MyUserContextProvider = (props: Props) => {
    const {
        session,
        isLoading: isLoadingUser,
        supabaseClient: supabase
    } = useSessionContext();
    const user = useSupaUser();
    const accessToken = session?.access_token ?? null;
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
    const [subscription, setSubscription] = useState<Subscription | null>(null);

    //쿼리 single -> maybeSingle
    //single로 요청시 supabase에서 406에러 발생
    //값이 없을 수도 있으므로 maybesingle이 나음
    const getUserDetails = () =>
        supabase.from('users')
            .select('*')
            .maybeSingle();

    //쿼리 single -> maybeSingle
    const getSubscription = () =>
        supabase
            .from('subscriptions')
            .select('*, prices(*, products(*))')
            .in('status', ['trialing', 'active'])
            .maybeSingle();

    useEffect(() => {

        if (user && !isLoadingData && !userDetails && !subscription) {
            setIsLoadingData(true)

            Promise.allSettled([getUserDetails(), getSubscription()]).then(
                (result) => {
                    console.log(result);

                    const userDetailsPromise = result[0];
                    const subscrptionPromise = result[1];

                    //수정필요한 부분
                    if (userDetailsPromise.status === "fulfilled") {
                        setUserDetails(userDetailsPromise.value.data as UserDetails);
                    }
                    //수정필요한 부분
                    if (subscrptionPromise.status === "fulfilled") {
                        setSubscription(subscrptionPromise.value.data as Subscription);
                    }

                    setIsLoadingData(false)
                })
        } else if (!user && !isLoadingUser && !isLoadingData) {
            setUserDetails(null);
            setSubscription(null);
        }
    }, [user, isLoadingUser])

    const value = {
        accessToken,
        user,
        userDetails,
        isLoading: isLoadingUser || isLoadingData,
        subscription
    }

    return <UserContext.Provider value={value} {...props} />
}

export const useUser = () => {
    const context = useContext(UserContext)
    if (context === undefined) {
        throw new Error("useUser must be ussed within a MyUserContextProvider")
    }

    return context;
}


