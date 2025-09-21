"use client";
import { useState, useCallback } from 'react';
import { ConfirmationType } from '../ui/common/confirmation';

interface ConfirmationState {
    isVisible: boolean;
    title: string;
    message: string;
    type: ConfirmationType;
    confirmText: string;
    cancelText: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmButtonLoading: boolean;
}

interface UseConfirmationReturn {
    confirmation: ConfirmationState;
    showConfirmation: (options: ShowConfirmationOptions) => void;
    hideConfirmation: () => void;
    setConfirmButtonLoading: (loading: boolean) => void;
}

interface ShowConfirmationOptions {
    title: string;
    message: string;
    type?: ConfirmationType;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel?: () => void;
}

export const useConfirmation = (): UseConfirmationReturn => {
    const [confirmation, setConfirmation] = useState<ConfirmationState>({
        isVisible: false,
        title: '',
        message: '',
        type: 'warning',
        confirmText: 'Xác nhận',
        cancelText: 'Hủy',
        onConfirm: () => {},
        onCancel: () => {},
        confirmButtonLoading: false
    });

    const showConfirmation = useCallback((options: ShowConfirmationOptions) => {
        setConfirmation({
            isVisible: true,
            title: options.title,
            message: options.message,
            type: options.type || 'warning',
            confirmText: options.confirmText || 'Xác nhận',
            cancelText: options.cancelText || 'Hủy',
            onConfirm: options.onConfirm,
            onCancel: options.onCancel || (() => hideConfirmation()),
            confirmButtonLoading: false
        });
    }, []);

    const hideConfirmation = useCallback(() => {
        setConfirmation(prev => ({
            ...prev,
            isVisible: false,
            confirmButtonLoading: false
        }));
    }, []);

    const setConfirmButtonLoading = useCallback((loading: boolean) => {
        setConfirmation(prev => ({
            ...prev,
            confirmButtonLoading: loading
        }));
    }, []);

    return {
        confirmation,
        showConfirmation,
        hideConfirmation,
        setConfirmButtonLoading
    };
};