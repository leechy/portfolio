<script>
	const lastUpdated = 'October 27, 2025';
	const contactEmail = 'andrey@lechev.me';
	const websiteUrl = 'https://www.leechy.dev';
</script>

<svelte:head>
	<title>Privacy Policy - Leechy.dev</title>
	<meta
		name="description"
		content="Privacy Policy for Leechy.dev - Learn how we protect and handle your personal information."
	/>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<main class="privacy-page">
	<div class="container">
		<header class="page-header">
			<h1>Privacy Policy</h1>
			<p class="last-updated">Last updated: {lastUpdated}</p>
		</header>

		<div class="content">
			<section class="intro">
				<p>
					This Privacy Policy describes how personal information is collected, used, and shared when
					you visit {websiteUrl} (the "Site").
				</p>
				<p>
					I am committed to protecting your privacy and being transparent about how I handle your
					information. This policy applies to all visitors and users of this website.
				</p>
			</section>

			<section>
				<h2>Information I Collect</h2>

				<h3>Information You Provide</h3>
				<ul>
					<li>
						<strong>Contact Information:</strong> When you contact me through forms or email, I collect
						your name, email address, and any message content you provide.
					</li>
					<li>
						<strong>Comments and Feedback:</strong> Any comments, suggestions, or feedback you voluntarily
						submit.
					</li>
				</ul>

				<h3>Information Automatically Collected</h3>
				<ul>
					<li>
						<strong>Analytics Data:</strong> I use analytics tools that may collect information about
						your visit, including pages viewed, time spent on the site, browser type, and general geographic
						location.
					</li>
					<li>
						<strong>Technical Information:</strong> IP address, browser type and version, operating system,
						referral URLs, and device information.
					</li>
					<li>
						<strong>Cookies:</strong> Small data files stored on your device to improve your browsing
						experience and analyze site usage.
					</li>
				</ul>
			</section>

			<section>
				<h2>How I Use Your Information</h2>
				<ul>
					<li>To respond to your inquiries and provide customer support</li>
					<li>To improve the website's functionality and user experience</li>
					<li>To analyze website traffic and usage patterns</li>
					<li>To prevent spam and abuse</li>
					<li>To comply with legal obligations</li>
				</ul>
			</section>

			<section>
				<h2>Information Sharing</h2>
				<p>
					I do not sell, trade, or otherwise transfer your personal information to third parties,
					except in the following cases:
				</p>
				<ul>
					<li>
						<strong>Service Providers:</strong> I may share information with trusted third-party services
						(like analytics providers) that help operate the website
					</li>
					<li>
						<strong>Legal Requirements:</strong> When required by law or to protect rights, property,
						or safety
					</li>
					<li>
						<strong>Business Transfers:</strong> In the event of a business sale or transfer (unlikely
						for a personal site)
					</li>
				</ul>
			</section>

			<section>
				<h2>Third-Party Services</h2>
				<p>This website may use third-party services such as:</p>
				<ul>
					<li><strong>Google Analytics:</strong> For website analytics (if applicable)</li>
					<li><strong>Content Delivery Networks (CDNs):</strong> For improved performance</li>
					<li><strong>Hosting Providers:</strong> For website hosting and infrastructure</li>
				</ul>
				<p>These services have their own privacy policies, and I encourage you to review them.</p>
			</section>

			<section>
				<h2>Data Security</h2>
				<p>
					I implement appropriate technical and organizational measures to protect your personal
					information against unauthorized access, alteration, disclosure, or destruction. However,
					no method of transmission over the internet is 100% secure.
				</p>
			</section>

			<section>
				<h2>Data Retention</h2>
				<p>
					I retain personal information only as long as necessary to fulfill the purposes outlined
					in this policy, comply with legal obligations, resolve disputes, and enforce agreements.
				</p>
			</section>

			<section>
				<h2>Your Rights</h2>
				<p>Depending on your location, you may have the following rights:</p>
				<ul>
					<li><strong>Access:</strong> Request information about personal data I hold about you</li>
					<li><strong>Correction:</strong> Request correction of inaccurate personal data</li>
					<li><strong>Deletion:</strong> Request deletion of your personal data</li>
					<li><strong>Objection:</strong> Object to the processing of your personal data</li>
					<li><strong>Portability:</strong> Request transfer of your data to another service</li>
				</ul>
				<p>
					To exercise these rights, please contact me at <a href="mailto:{contactEmail}"
						>{contactEmail}</a
					>.
				</p>
			</section>

			<section>
				<h2>Cookies</h2>
				<p>
					This website may use cookies to enhance your browsing experience. Cookies are small text
					files stored on your device that help me analyze web traffic and remember your
					preferences.
				</p>
				<p>
					You can control cookies through your browser settings. Note that disabling cookies may
					affect website functionality.
				</p>
			</section>

			<section>
				<h2>Children's Privacy</h2>
				<p>
					This website is not intended for children under 13 years of age. I do not knowingly
					collect personal information from children under 13. If you believe a child has provided
					personal information, please contact me immediately.
				</p>
			</section>

			<section>
				<h2>International Visitors</h2>
				<p>
					This website is hosted and operated from [Your Country]. If you are visiting from other
					countries, please be aware that your information may be transferred to, stored, and
					processed in [Your Country].
				</p>
			</section>

			<section>
				<h2>Changes to This Policy</h2>
				<p>
					I may update this Privacy Policy from time to time. Any changes will be posted on this
					page with an updated "Last modified" date. I encourage you to review this policy
					periodically.
				</p>
			</section>

			<section>
				<h2>Contact Information</h2>
				<p>
					If you have questions about this Privacy Policy or how your information is handled, please
					contact me:
				</p>
				<div class="contact-info">
					<p><strong>Email:</strong> <a href="mailto:{contactEmail}">{contactEmail}</a></p>
					<p><strong>Website:</strong> <a href={websiteUrl}>{websiteUrl}</a></p>
				</div>
			</section>
		</div>
	</div>
</main>

<style lang="scss">
	.privacy-page {
		min-height: 100vh;
		padding: var(--spacing-xl) 0 var(--spacing-3xl);
	}

	.container {
		max-width: 1024px;
		margin: 0 auto;
		padding: 0 var(--spacing-xl);
	}

	.page-header {
		text-align: center;
		margin-bottom: var(--spacing-2xl);
		padding-bottom: var(--spacing-xl);
		border-bottom: 2px solid var(--color-primary);

		h1 {
			font-size: var(--font-size-5xl);
			color: var(--color-text-primary);
			margin-bottom: var(--font-size-md);
			font-weight: 700;

			@media (max-width: $breakpoint-md) {
				font-size: var(--font-size-4xl);
			}
		}

		.last-updated {
			color: var(--color-text-secondary);
			font-style: italic;
			font-size: var(--font-size-base);
		}
	}

	.content {
		line-height: 1.7;
		color: var(--color-text-primary);

		section {
			margin-bottom: var(--spacing-xl);

			&.intro {
				background: color-mix(in srgb, var(--color-primary), transparent 90%);
				padding: var(--spacing-lg);
				border-radius: 8px;
				border-left: 4px solid var(--color-primary);
				margin-bottom: var(--spacing-2xl);

				p {
					margin-bottom: var(--spacing-md);
					font-size: var(--font-size-lg);

					&:last-child {
						margin-bottom: 0;
					}
				}
			}
		}

		h2 {
			font-size: var(--font-size-3xl);
			color: var(--color-primary);
			margin-bottom: var(--spacing-md);
			margin-top: var(--spacing-xl);
			font-weight: 600;
			border-bottom: 1px solid var(--color-border);
			padding-bottom: var(--spacing-sm);

			&:first-of-type {
				margin-top: 0;
			}
		}

		h3 {
			font-size: var(--font-size-xl);
			color: var(--color-text-primary);
			margin: var(--spacing-lg) 0 var(--spacing-md);
			font-weight: 600;
		}

		p {
			margin-bottom: var(--spacing-md);
			font-size: var(--font-size-md);

			&:last-child {
				margin-bottom: 0;
			}
		}

		ul,
		ol {
			margin: var(--spacing-md) 0;
			padding-left: var(--spacing-xl);

			li {
				margin-bottom: var(--spacing-sm);

				strong {
					color: var(--color-text-primary);
				}
			}
		}

		a {
			color: var(--color-primary);
			text-decoration: none;
			font-weight: 500;
			transition: all 0.3s ease;

			&:hover {
				color: color-mix(in srgb, var(--color-primary), black 10%);
				text-decoration: underline;
			}
		}

		.contact-info {
			background: var(--color-bg-secondary);
			padding: var(--spacing-lg);
			border-radius: 8px;
			margin-top: var(--spacing-md);
			margin-left: calc(-1 * var(--spacing-lg));

			p {
				margin-bottom: var(--spacing-sm);

				&:last-child {
					margin-bottom: 0;
				}
			}

			strong {
				color: var(--color-text-primary);
			}
		}
	}

	@media (max-width: $breakpoint-md) {
		.privacy-page {
			padding: var(--spacing-md) 0 var(--spacing-2xl);
		}

		.container {
			padding: 0 var(--spacing-md);
		}

		.content {
			h2 {
				font-size: var(--font-size-2xl);
			}

			h3 {
				font-size: var(--font-size-lg);
			}

			ul,
			ol {
				padding-left: var(--font-size-2xl);
			}

			.contact-info {
				margin-left: 0;
			}
		}
	}
</style>
