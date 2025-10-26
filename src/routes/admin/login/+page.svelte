<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { authStore, login, initAuth } from '$lib/auth/auth';

	let loginForm = {
		email: '',
		password: ''
	};

	let errors = {};
	let isLoading = false;

	onMount(() => {
		// Initialize auth system
		initAuth();

		// If already authenticated, redirect to dashboard
		const unsubscribe = authStore.subscribe(auth => {
			if (!auth.loading && auth.isAuthenticated) {
				goto('/admin/dashboard');
			}
		});

		return unsubscribe;
	});

	async function handleLogin(event) {
		event.preventDefault();
		errors = {};
		isLoading = true;

		// Basic validation
		if (!loginForm.email) {
			errors.email = 'Email is required';
		}
		if (!loginForm.password) {
			errors.password = 'Password is required';
		}

		if (Object.keys(errors).length > 0) {
			isLoading = false;
			return;
		}

		try {
			const result = await login(loginForm.email, loginForm.password);

			if (result.success) {
				// Authentication successful, redirect to dashboard
				goto('/admin/dashboard');
			} else {
				errors.general = result.error || 'Authentication failed';
			}
		} catch (error) {
			console.error('Login error:', error);
			errors.general = 'Login failed. Please try again.';
		} finally {
			isLoading = false;
		}
	}
</script>

<svelte:head>
	<title>Admin Login - Leechy Dev</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="login-container">
	<div class="login-card">
		<div class="login-header">
			<h1>Admin Login</h1>
			<p>Sign in to access the admin panel</p>
		</div>

		<form class="login-form" on:submit={handleLogin} data-testid="login-form">
			{#if errors.general}
				<div class="error-message" data-testid="login-error">
					{errors.general}
				</div>
			{/if}

			<div class="form-group">
				<label for="email">Email</label>
				<input
					id="email"
					name="email"
					type="email"
					bind:value={loginForm.email}
					class:error={errors.email}
					placeholder="admin@leechy.dev"
					data-testid="email-input"
				/>
				{#if errors.email}
					<span class="field-error">{errors.email}</span>
				{/if}
			</div>

			<div class="form-group">
				<label for="password">Password</label>
				<input
					id="password"
					name="password"
					type="password"
					bind:value={loginForm.password}
					class:error={errors.password}
					placeholder="Enter your password"
					data-testid="password-input"
				/>
				{#if errors.password}
					<span class="field-error">{errors.password}</span>
				{/if}
			</div>

			<button type="submit" class="login-button" disabled={isLoading} data-testid="login-submit">
				{#if isLoading}
					<svg class="spinner" viewBox="0 0 24 24">
						<circle
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							stroke-width="4"
							fill="none"
							opacity="0.25"
						/>
						<path
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						/>
					</svg>
					Signing in...
				{:else}
					Sign In
				{/if}
			</button>
		</form>

		<div class="login-footer">
			<a href="/" class="back-link">
				<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M10 19l-7-7m0 0l7-7m-7 7h18"
					/>
				</svg>
				Back to site
			</a>
		</div>

		<!-- Demo credentials hint -->
		<div class="demo-hint">
			<strong>Demo:</strong> Email: admin@leechy.dev, Password: admin123
		</div>
	</div>
</div>

<style lang="scss">
	.login-container {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		padding: 1rem;
	}

	.login-card {
		background: white;
		border-radius: 1rem;
		box-shadow:
			0 20px 25px -5px rgba(0, 0, 0, 0.1),
			0 10px 10px -5px rgba(0, 0, 0, 0.04);
		width: 100%;
		max-width: 400px;
		padding: 2rem;
	}

	.login-header {
		text-align: center;
		margin-bottom: 2rem;

		h1 {
			font-size: 1.875rem;
			font-weight: 700;
			color: #1e293b;
			margin: 0 0 0.5rem 0;
		}

		p {
			color: #64748b;
			margin: 0;
		}
	}

	.login-form {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.error-message {
		background: #fef2f2;
		color: #dc2626;
		padding: 0.75rem 1rem;
		border-radius: 0.5rem;
		border: 1px solid #fecaca;
		font-size: 0.875rem;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	label {
		font-weight: 500;
		color: #374151;
		font-size: 0.875rem;
	}

	input {
		padding: 0.75rem 1rem;
		border: 1px solid #d1d5db;
		border-radius: 0.5rem;
		font-size: 1rem;
		transition: all 0.2s;

		&:focus {
			outline: none;
			border-color: #3b82f6;
			box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
		}

		&.error {
			border-color: #dc2626;
			box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
		}

		&::placeholder {
			color: #9ca3af;
		}
	}

	.field-error {
		color: #dc2626;
		font-size: 0.75rem;
		margin-top: 0.25rem;
	}

	.login-button {
		background: #3b82f6;
		color: white;
		border: none;
		padding: 0.875rem 1rem;
		border-radius: 0.5rem;
		font-size: 1rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;

		&:hover:not(:disabled) {
			background: #2563eb;
		}

		&:disabled {
			opacity: 0.6;
			cursor: not-allowed;
		}
	}

	.spinner {
		width: 1rem;
		height: 1rem;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.login-footer {
		margin-top: 2rem;
		text-align: center;
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		color: #64748b;
		text-decoration: none;
		font-size: 0.875rem;
		transition: color 0.2s;

		&:hover {
			color: #374151;
		}

		svg {
			width: 1rem;
			height: 1rem;
		}
	}

	.demo-hint {
		margin-top: 1.5rem;
		padding: 0.75rem;
		background: #fef3c7;
		border: 1px solid #fcd34d;
		border-radius: 0.5rem;
		font-size: 0.875rem;
		color: #92400e;
		text-align: center;
	}

	@media (max-width: 480px) {
		.login-card {
			padding: 1.5rem;
		}

		.login-header h1 {
			font-size: 1.5rem;
		}
	}
</style>
