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

    const getUserDetails = () =>
        supabase.from('users')
            .select('*');
            // .single();
    const getSubscription = () =>
        supabase
            .from('subscriptions')
            .select('*, prices(*, products(*))')
            .in('status', ['trialing', 'active'])
            // .single();

    useEffect(() => {
        console.log(user);
        console.log(isLoadingData);
        console.log(userDetails);
        if (user && !isLoadingData && !userDetails && !subscription) {
            setIsLoadingData(true)
            console.log(user);
            Promise.allSettled([getUserDetails(), getSubscription()]).then(
                (result) => {
                    console.log(result);

                    const userDetailsPromise = result[0]
                    const subscrptionPromise = result[1];
                    console.log(result[0]);
                    console.log(result[1]);
                    if (userDetailsPromise.status === "fulfilled") {
                        setUserDetails(userDetailsPromise.value.data[0] as UserDetails);
                    }

                    if (subscrptionPromise.status === "fulfilled") {
                        setSubscription(subscrptionPromise.value.data[0] as Subscription);
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


