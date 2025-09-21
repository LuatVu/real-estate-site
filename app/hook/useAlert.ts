"use client";
import { useState, useCallback } from 'react';
import { AlertType } from '../ui/common/alert';

interface AlertState {
    isVisible: boolean;
    type: AlertType;
    message: string;
}

interface UseAlertReturn {
    alert: AlertState;
    showSuccess: (message: string) => void;
    showError: (message: string) => void;
    showWarning: (message: string) => void;
    showInfo: (message: string) => void;
    hideAlert: () => void;
}

export const useAlert = (): UseAlertReturn => {
    const [alert, setAlert] = useState<AlertState>({
        isVisible: false,
        type: 'success',
        message: ''
    });

    const showSuccess = useCallback((message: string) => {
        setAlert({
            isVisible: true,
            type: 'success',
            message
        });
    }, []);

    const showError = useCallback((message: string) => {
        setAlert({
            isVisible: true,
            type: 'error',
            message
        });
    }, []);

    const showWarning = useCallback((message: string) => {
        setAlert({
            isVisible: true,
            type: 'warning',
            message
        });
    }, []);

    const showInfo = useCallback((message: string) => {
        setAlert({
            isVisible: true,
            type: 'info',
            message
        });
    }, []);

    const hideAlert = useCallback(() => {
        setAlert(prev => ({
            ...prev,
            isVisible: false
        }));
    }, []);

    return {
        alert,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        hideAlert
    };
};