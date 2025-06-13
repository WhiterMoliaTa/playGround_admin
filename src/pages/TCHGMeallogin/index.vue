<template>
  <div class="tchg-meal-login-page">
    <div class="logo-container">
      <img src="./hospital-logo.png" alt="Hospital Logo" class="hospital-logo" />
    </div>
    <v-card class="login-card">
      <v-card-title class="app-title">供膳衛生安全管理作業系統</v-card-title>
      <v-card-text>
        <v-form>
          <div class="form-group username-field">
            <label for="username">登入帳號</label>
            <v-text-field v-model="username" id="username" type="email" variant="underlined" density="comfortable"
              placeholder="example@mail.com.tw" hide-details class="mb-4"
              :error-messages="usernameError"></v-text-field>
          </div>
          <div class="form-group password-field">
            <label for="password">登入密碼</label>
            <v-text-field v-model="password" id="password" :type="showPassword ? 'text' : 'password'"
              variant="underlined" density="comfortable" hide-details class="mb-2" :error-messages="passwordError"
              :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append-inner="showPassword = !showPassword" autocomplete="off">
            </v-text-field>
          </div>
          <div class="remember-me">
            <v-checkbox v-model="rememberMe" density="compact" hide-details class="remember-me-checkbox">
              <template v-slot:label>
                <span class="remember-me-text">記住我的帳號</span>
              </template>
            </v-checkbox>
          </div>
          <v-btn block color="#6369E8" height="48" rounded="xl" class="login-btn mt-6" :loading="loading"
            @click="login">
            登入
          </v-btn>

          <div class="forgot-password text-center mt-4">
            <a href="#" @click.prevent="forgotPassword">忘記密碼?</a>
          </div>
        </v-form>
      </v-card-text>
    </v-card>

    <div class="copyright">
      Copyright © 臺北市立聯合醫院所有
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const username = ref('');
const password = ref('');
const rememberMe = ref(false);
const showPassword = ref(false);
const loading = ref(false);
const usernameError = ref('');
const passwordError = ref('');

// TODO 改成api呼叫
onMounted(() => {
  const savedUsername = localStorage.getItem('tchg_username');
  if (savedUsername) {
    username.value = savedUsername;
    rememberMe.value = true;
  }
});

const validateForm = () => {
  let isValid = true;

  usernameError.value = '';
  passwordError.value = '';

  // TODO 改成api呼叫
  if (!username.value) {
    usernameError.value = '請輸入帳號';
    isValid = false;
  } else if (!username.value.includes('@')) {
    usernameError.value = '請輸入有效的電子郵件';
    isValid = false;
  }

  if (!password.value) {
    passwordError.value = '請輸入密碼';
    isValid = false;
  }

  return isValid;
};

const login = async () => {
  if (!validateForm()) return;

  loading.value = true;

  try {
    // TODO 改成api呼叫
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (rememberMe.value) {
      localStorage.setItem('tchg_username', username.value);
    } else {
      localStorage.removeItem('tchg_username');
    }

    // TODO 跳轉前添加API呼叫
    router.push('/TCHGmealSys');
  } catch (error) {
    console.error('Login failed:', error);
  } finally {
    loading.value = false;
  }
};

const forgotPassword = () => {
  alert('忘記密碼功能尚未實作');
};
</script>

<style scoped>
:deep(.password-field .v-field.v-field--variant-underlined .v-field__append-inner) {
  padding-top: 0;
}

.tchg-meal-login-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1rem;
  background-color: #f5f7fa;
  position: relative;
  margin: 0 auto;
}

.logo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
}

.hospital-logo {
  max-width: 100px;
  max-height: 100px;
  object-fit: contain;
}

.app-title {
  color: #4355b9;
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 0.5rem;
}

.login-card {
  width: 100%;
  border-radius: 12px;
  padding: 1rem;
  background-color: white;
  box-shadow: 0 0 0.8em 0.1em rgba(133, 133, 133, 0.219);
  height: fit-content;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-size: 0.7rem;
  color: #4355b9;
  margin-bottom: 0.25rem;
}

.remember-me {
  display: flex;
  align-items: center;
}

.remember-me-checkbox {
  color: #4355b9;
}

.remember-me-text {
  font-size: 0.9rem;
  color: #666;
}

.login-btn {
  text-transform: none;
  border-radius: 8px;
  font-size: 1rem;
}

.forgot-password a {
  color: #4355b9;
  text-decoration: none;
  font-size: 0.9rem;
  text-decoration: underline;
}

.copyright {
  color: #888;
  font-size: 0.8rem;
  margin-top: 2rem;
  text-align: center;
}

/* Mobile adjustments */
@media (max-width: 320px) {
  .tchg-meal-login-page {
    justify-content: center;
  }

  .login-card {
    width: 100%;
    border-radius: 12px;
    padding: 1rem;
    background-color: white;
    box-shadow: 0 0 0.8em 0.1em rgba(133, 133, 133, 0.219);
  }

  .app-title {
    color: #4355b9;
    font-size: 1.2rem;
    font-weight: 600;
    text-align: center;
    margin-bottom: 0.5rem;
    padding: 0;
  }

  .hospital-logo {
    max-width: 100px;
    max-height: 100px;
    object-fit: contain;
  }

  .copyright {
    position: absolute;
    bottom: 0.1rem;
    width: 100%;
    text-align: center;
  }
}

@media (max-width: 320px) and (min-height: 700px) {
  .hospital-logo {
    max-width: 200px;
    max-height: 200px;
    object-fit: contain;
  }
}
</style>