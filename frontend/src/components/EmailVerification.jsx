import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Mail, RotateCcw, CheckCircle, Loader2 } from "lucide-react";
import { message } from "antd";
import Auth from "../assets/api/Auth";

export default function EmailVerification() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (!user) {
      navigate('/sign', { replace: true });
    } else if (user?.email_verified_at) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleResendEmail = async () => {
    setIsLoading(true);
    try {
      const res = await Auth.ResendVerificationEmail();
      if (res.success) {
        messageApi.success(res.message);
        setCountdown(30);
      } else {
        messageApi.error(res.message);
      }
    } catch (error) {
      messageApi.error("Failed to send verification email");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || user.email_verified_at) {
    return null;
  }

  const isButtonDisabled = isLoading || countdown > 0;

  return (
    <div className="flex items-center justify-center bg-base-100 p-4" style={{ minHeight: "calc(100vh - 70px)" }}>
      {contextHolder}
      <div className="w-full max-w-md bg-base-200 rounded-2xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-warning/20 rounded-full mb-4">
            <Mail size={32} className="text-warning" />
          </div>
          <h1 className="text-2xl font-bold text-base-content mb-2">
            Verify Your Email
          </h1>
          <p className="text-base-content/70 text-sm">
            Please check your email and click the verification link to continue.
          </p>
        </div>

        <div className="bg-base-100 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle size={20} className="text-success flex-shrink-0" />
            <span className="text-sm font-medium">Email sent to:</span>
          </div>
          <p className="text-base-content font-semibold break-all text-center">
            {user?.email}
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleResendEmail}
            disabled={isButtonDisabled}
            className={`btn w-full ${isButtonDisabled ? 'btn-disabled' : 'btn-primary'}`}
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Sending...
              </>
            ) : countdown > 0 ? (
              <>
                <RotateCcw size={16} />
                Resend in {countdown}s
              </>
            ) : (
              <>
                <RotateCcw size={16} />
                Resend Verification Email
              </>
            )}
          </button>

          <div className="text-center">
            <p className="text-xs text-base-content/60">
              Didn't receive the email? Check your spam folder or click resend above.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}