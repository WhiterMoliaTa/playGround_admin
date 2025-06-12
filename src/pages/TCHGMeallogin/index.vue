<template>
  <div class="login-page">
    <!-- Hospital logo and app title -->
    <div class="logo-container">
      <img src="./hospital-logo.png" alt="Hospital Logo" class="hospital-logo" />
      <h1 class="app-title">供膳衛生安全管理作業系統</h1>
    </div>

    <!-- Login form card -->
    <v-card class="login-card" elevation="0">
      <v-card-text>
        <!-- Username input -->
        <div class="form-group">
          <label for="username">登入帳號</label>
          <v-text-field
            v-model="username"
            id="username"
            variant="outlined"
            density="comfortable"
            placeholder="example@hyweb.com.tw"
            hide-details
            class="mb-4"
            :error-messages="usernameError"
          ></v-text-field>
        </div>

        <!-- Password input -->
        <div class="form-group">
          <label for="password">登入密碼</label>
          <v-text-field
            v-model="password"
            id="password"
            :type="showPassword ? 'text' : 'password'"
            variant="outlined"
            density="comfortable"
            hide-details
            class="mb-2"
            :error-messages="passwordError"
            :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="showPassword = !showPassword"
          ></v-text-field>
        </div>

        <!-- Remember me checkbox -->
        <div class="remember-me">
          <v-checkbox v-model="rememberMe" density="compact" hide-details color="primary">
            <template v-slot:label>
              <span class="remember-me-text">記住我的帳號</span>
            </template>
          </v-checkbox>
        </div>

        <!-- Login button -->
        <v-btn
          block
          color="#6369E8"
          height="48"
          class="login-btn mt-6"
          :loading="loading"
          @click="login"
        >
          登入
        </v-btn>

        <!-- Forgot password link -->
        <div class="forgot-password text-center mt-2">
          <a href="#" @click.prevent="forgotPassword">忘記密碼?</a>
        </div>
      </v-card-text>
    </v-card>

    <!-- Copyright info -->
    <div class="copyright">
      Copyright © 臺北市立聯合醫院附設
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed} from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const username = ref('');
const password = ref('');
const rememberMe = ref(false);
const showPassword = ref(false);
const loading = ref(false);
const usernameError = ref('');
const passwordError = ref('');

// Check for saved credentials on page load
onMounted(() => {
  const savedUsername = localStorage.getItem('tchg_username');
  if (savedUsername) {
    username.value = savedUsername;
    rememberMe.value = true;
  }
});

// Validate form fields
const validateForm = () => {
  let isValid = true;
  
  // Reset error messages
  usernameError.value = '';
  passwordError.value = '';

  // Validate username
  if (!username.value) {
    usernameError.value = '請輸入帳號';
    isValid = false;
  } else if (!username.value.includes('@')) {
    usernameError.value = '請輸入有效的電子郵件';
    isValid = false;
  }

  // Validate password
  if (!password.value) {
    passwordError.value = '請輸入密碼';
    isValid = false;
  }

  return isValid;
};

// Login handler
const login = async () => {
  if (!validateForm()) return;
  
  loading.value = true;
  
  try {
    // Simulate API call - replace with actual authentication
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Save username if rememberMe is checked
    if (rememberMe.value) {
      localStorage.setItem('tchg_username', username.value);
    } else {
      localStorage.removeItem('tchg_username');
    }
    
    // Mock successful login - replace with your auth logic
    router.push('/TCHGmealSys');
  } catch (error) {
    console.error('Login failed:', error);
    // Handle login failure
  } finally {
    loading.value = false;
  }
};

// Forgot password handler
const forgotPassword = () => {
  alert('忘記密碼功能尚未實作');
};
</script>

<style scoped>
.login-page {
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 2rem 1rem;
  background-color: #f5f7fa;
  position: relative;
  max-width: 500px;
  margin: 0 auto;
}

.logo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
}

.hospital-logo {
  width: 80px;
  height: 80px;
  object-fit: contain;
  margin-bottom: 1rem;
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
  background-color: white;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-size: 0.9rem;
  color: #4355b9;
  margin-bottom: 0.25rem;
}

.remember-me {
  display: flex;
  align-items: center;
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
}

.copyright {
  color: #888;
  font-size: 0.8rem;
  margin-top: 2rem;
  text-align: center;
}

/* Mobile adjustments */
@media (max-width: 500px) {
  .login-page {
    justify-content: center;
  }
  
  .logo-container {
    margin-top: -5rem;
  }
  
  .copyright {
    position: absolute;
    bottom: 1rem;
    width: 100%;
    text-align: center;
  }
}
</style>