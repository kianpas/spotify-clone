/**
 * 상태관리 - zustand 사용
 */

import { create } from "zustand"

interface AuthModalStore {
    isOpen: boolean
    onOpen: () => void;
    onClose: () => void;
}

//사용자인증 모달창 상태
const useAuthModal = create<AuthModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false })
}))

export default useAuthModal;