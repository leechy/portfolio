import { beforeEach, describe, expect, it } from 'vitest';
import { get } from 'svelte/store';
import {
	blogStore,
	getAllBlogTags,
	loadBlogs,
	searchBlogs,
	filterBlogsByTag,
	type BlogPost
} from '$lib/stores/blogs';

describe('Blog Search Integration Tests', () => {
	beforeEach(() => {
		// Reset store before each test
		blogStore.set({
			blogs: [],
			featured: [],
			loading: false,
			error: null
		});
	});

	describe('Search Query Processing', () => {
		it('should handle empty search queries', async () => {
			await loadBlogs();
			const state = get(blogStore);

			const results = searchBlogs('');
			expect(results).toEqual(state.blogs); // Should return all blogs for empty search
		});

		it('should handle whitespace-only search queries', async () => {
			await loadBlogs();
			const state = get(blogStore);

			const results = searchBlogs('   ');
			expect(results).toEqual(state.blogs); // Should return all blogs for whitespace
		});

		it('should trim search queries', async () => {
			await loadBlogs();

			const query = 'javascript';
			const trimmedResults = searchBlogs(query);
			const untrimmedResults = searchBlogs(`  ${query}  `);

			expect(trimmedResults).toEqual(untrimmedResults);
		});

		it('should handle special characters in search queries', async () => {
			await loadBlogs();

			const specialQueries = ['C++', 'Node.js', 'React/Next.js', '@types', '#hashtag'];

			specialQueries.forEach(query => {
				const results = searchBlogs(query);
				expect(Array.isArray(results)).toBe(true);
				// Should not throw errors for special characters
			});
		});

		it('should handle very long search queries', async () => {
			await loadBlogs();

			const longQuery = 'a'.repeat(1000); // 1000 character string
			const results = searchBlogs(longQuery);

			expect(Array.isArray(results)).toBe(true);
			// Should handle long queries without performance issues
		});
	});

	describe('Title Search Functionality', () => {
		it('should find blogs by exact title match', async () => {
			await loadBlogs();
			const state = get(blogStore);

			if (state.blogs.length > 0) {
				const targetBlog = state.blogs[0];
				const results = searchBlogs(targetBlog.title);

				expect(results.length).toBeGreaterThan(0);
				expect(results.find(blog => blog.id === targetBlog.id)).toBeDefined();
			}
		});

		it('should find blogs by partial title match', async () => {
			await loadBlogs();
			const state = get(blogStore);

			if (state.blogs.length > 0) {
				const targetBlog = state.blogs[0];
				const partialTitle = targetBlog.title.split(' ')[0]; // First word

				if (partialTitle.length > 2) {
					// Only test if word is meaningful
					const results = searchBlogs(partialTitle);

					expect(Array.isArray(results)).toBe(true);
					// Should find the target blog or other blogs with similar titles
					const hasRelevantResult = results.some(blog =>
						blog.title.toLowerCase().includes(partialTitle.toLowerCase())
					);
					expect(hasRelevantResult).toBe(true);
				}
			}
		});

		it('should perform case-insensitive title search', async () => {
			await loadBlogs();
			const state = get(blogStore);

			if (state.blogs.length > 0) {
				const targetBlog = state.blogs[0];
				const titleWord = targetBlog.title.split(' ')[0];

				const lowerResults = searchBlogs(titleWord.toLowerCase());
				const upperResults = searchBlogs(titleWord.toUpperCase());
				const mixedResults = searchBlogs(titleWord);

				expect(lowerResults.length).toBe(upperResults.length);
				expect(upperResults.length).toBe(mixedResults.length);
			}
		});
	});

	describe('Content Search Functionality', () => {
		it('should find blogs by content keywords', async () => {
			await loadBlogs();
			const state = get(blogStore);

			if (state.blogs.length > 0) {
				const targetBlog = state.blogs[0];
				const contentWords = targetBlog.content.split(' ').filter(word => word.length > 4);

				if (contentWords.length > 0) {
					const keyword = contentWords[0];
					const results = searchBlogs(keyword);

					expect(Array.isArray(results)).toBe(true);
					// Should find blogs containing the keyword
					const hasRelevantResult = results.some(
						blog =>
							blog.content.toLowerCase().includes(keyword.toLowerCase()) ||
							blog.title.toLowerCase().includes(keyword.toLowerCase()) ||
							blog.excerpt.toLowerCase().includes(keyword.toLowerCase())
					);
					expect(hasRelevantResult).toBe(true);
				}
			}
		});

		it('should search in excerpts', async () => {
			await loadBlogs();
			const state = get(blogStore);

			if (state.blogs.length > 0) {
				const targetBlog = state.blogs[0];
				const excerptWords = targetBlog.excerpt.split(' ').filter(word => word.length > 4);

				if (excerptWords.length > 0) {
					const keyword = excerptWords[0];
					const results = searchBlogs(keyword);

					expect(Array.isArray(results)).toBe(true);
					// Should find the target blog or blogs with similar excerpts
					const foundTargetBlog = results.find(blog => blog.id === targetBlog.id);
					expect(foundTargetBlog).toBeDefined();
				}
			}
		});

		it('should rank exact matches higher than partial matches', async () => {
			await loadBlogs();
			const state = get(blogStore);

			if (state.blogs.length > 1) {
				// Find a blog with a distinctive word in title
				const targetBlog = state.blogs.find(blog => {
					const titleWords = blog.title.split(' ');
					return titleWords.some(word => word.length > 6);
				});

				if (targetBlog) {
					const exactWord = targetBlog.title.split(' ').find(word => word.length > 6);
					if (exactWord) {
						const results = searchBlogs(exactWord);

						// The blog with exact title match should be ranked highly
						const targetIndex = results.findIndex(blog => blog.id === targetBlog.id);
						expect(targetIndex).toBeGreaterThanOrEqual(0);
						expect(targetIndex).toBeLessThan(3); // Should be in top 3 results
					}
				}
			}
		});
	});

	describe('Tag Search Functionality', () => {
		it('should find blogs by tag names', async () => {
			await loadBlogs();
			const allTags = getAllBlogTags();

			if (allTags.length > 0) {
				const targetTag = allTags[0];
				const results = searchBlogs(targetTag);

				expect(Array.isArray(results)).toBe(true);
				expect(results.length).toBeGreaterThan(0);

				// All results should contain the searched tag
				results.forEach(blog => {
					expect(blog.tags).toContain(targetTag);
				});
			}
		});

		it('should find blogs by partial tag names', async () => {
			await loadBlogs();
			const allTags = getAllBlogTags();

			// Find a tag that can be partially searched
			const longTag = allTags.find(tag => tag.length > 4);

			if (longTag) {
				const partialTag = longTag.substring(0, longTag.length - 1);
				const results = searchBlogs(partialTag);

				expect(Array.isArray(results)).toBe(true);
				// Should find blogs with tags containing the partial string
				const hasMatchingResult = results.some(blog =>
					blog.tags.some(tag => tag.toLowerCase().includes(partialTag.toLowerCase()))
				);
				expect(hasMatchingResult).toBe(true);
			}
		});

		it('should handle tag search case-insensitively', async () => {
			await loadBlogs();
			const allTags = getAllBlogTags();

			if (allTags.length > 0) {
				const targetTag = allTags[0];

				const lowerResults = searchBlogs(targetTag.toLowerCase());
				const upperResults = searchBlogs(targetTag.toUpperCase());

				expect(lowerResults.length).toBe(upperResults.length);
			}
		});
	});

	describe('Multi-field Search', () => {
		it('should search across title, content, excerpt, and tags simultaneously', async () => {
			await loadBlogs();
			const state = get(blogStore);

			if (state.blogs.length > 0) {
				// Use a common word like "the", "and", "development" that might appear in multiple fields
				const commonTerms = ['development', 'javascript', 'web', 'code', 'build'];

				commonTerms.forEach(term => {
					const results = searchBlogs(term);

					if (results.length > 0) {
						// Verify that results contain the term in at least one field
						results.forEach(blog => {
							const termInTitle = blog.title.toLowerCase().includes(term.toLowerCase());
							const termInExcerpt = blog.excerpt.toLowerCase().includes(term.toLowerCase());
							const termInContent = blog.content.toLowerCase().includes(term.toLowerCase());
							const termInTags = blog.tags.some(tag =>
								tag.toLowerCase().includes(term.toLowerCase())
							);

							expect(termInTitle || termInExcerpt || termInContent || termInTags).toBe(true);
						});
					}
				});
			}
		});

		it('should prioritize title matches over content matches', async () => {
			await loadBlogs();
			const state = get(blogStore);

			// This test assumes we have blogs with specific patterns
			// In a real implementation, we would test ranking logic
			const results = searchBlogs('guide');

			if (results.length > 1) {
				// Check if blogs with title matches appear before content-only matches
				const titleMatchIndex = results.findIndex(blog =>
					blog.title.toLowerCase().includes('guide')
				);
				const contentOnlyMatchIndex = results.findIndex(
					blog =>
						!blog.title.toLowerCase().includes('guide') &&
						blog.content.toLowerCase().includes('guide')
				);

				if (titleMatchIndex >= 0 && contentOnlyMatchIndex >= 0) {
					expect(titleMatchIndex).toBeLessThan(contentOnlyMatchIndex);
				}
			}
		});
	});

	describe('Tag Filtering Integration', () => {
		it('should filter blogs by selected tags', async () => {
			await loadBlogs();
			const allTags = getAllBlogTags();

			if (allTags.length > 0) {
				const targetTag = allTags[0];
				const filteredBlogs = filterBlogsByTag(targetTag);

				expect(Array.isArray(filteredBlogs)).toBe(true);

				filteredBlogs.forEach(blog => {
					expect(blog.tags).toContain(targetTag);
				});
			}
		});

		it('should combine search and tag filtering', async () => {
			await loadBlogs();
			const allTags = getAllBlogTags();

			if (allTags.length > 0) {
				const targetTag = allTags[0];
				const filteredBlogs = filterBlogsByTag(targetTag);

				if (filteredBlogs.length > 0) {
					// Now search within filtered results
					const searchTerm = 'test';
					const searchResults = searchBlogs(searchTerm);

					// Intersection of filtered and search results
					const combinedResults = filteredBlogs.filter(filteredBlog =>
						searchResults.some(searchBlog => searchBlog.id === filteredBlog.id)
					);

					// Combined results should have the tag AND match the search
					combinedResults.forEach(blog => {
						expect(blog.tags).toContain(targetTag);

						const matchesSearch =
							blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
							blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
							blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
							blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

						expect(matchesSearch).toBe(true);
					});
				}
			}
		});

		it('should maintain tag list consistency after filtering', async () => {
			await loadBlogs();
			const originalTags = getAllBlogTags();

			if (originalTags.length > 0) {
				// Filter by a tag
				filterBlogsByTag(originalTags[0]);

				// Tag list should remain the same
				const tagsAfterFilter = getAllBlogTags();
				expect(tagsAfterFilter).toEqual(originalTags);
			}
		});
	});

	describe('Search Performance', () => {
		it('should handle large result sets efficiently', async () => {
			await loadBlogs();

			const startTime = performance.now();

			// Search for a common term that might return many results
			searchBlogs('a');

			const endTime = performance.now();
			const searchTime = endTime - startTime;

			// Search should complete within 50ms for reasonable dataset sizes
			expect(searchTime).toBeLessThan(50);
		});

		it('should handle rapid consecutive searches', async () => {
			await loadBlogs();

			const searchQueries = ['javascript', 'react', 'svelte', 'css', 'html'];

			const startTime = performance.now();

			searchQueries.forEach(query => {
				searchBlogs(query);
			});

			const endTime = performance.now();
			const totalTime = endTime - startTime;

			// Multiple searches should complete quickly
			expect(totalTime).toBeLessThan(100);
		});

		it('should not degrade performance with complex queries', async () => {
			await loadBlogs();

			const complexQueries = [
				'javascript framework development',
				'react svelte vue comparison',
				'web development best practices tutorial'
			];

			complexQueries.forEach(query => {
				const startTime = performance.now();
				searchBlogs(query);
				const endTime = performance.now();

				expect(endTime - startTime).toBeLessThan(25);
			});
		});
	});

	describe('Search Result Quality', () => {
		it('should return relevant results for technical terms', async () => {
			await loadBlogs();

			const technicalTerms = ['API', 'component', 'state', 'props', 'routing'];

			technicalTerms.forEach(term => {
				const results = searchBlogs(term);

				// Each result should be relevant to the search term
				results.forEach(blog => {
					const isRelevant =
						blog.title.toLowerCase().includes(term.toLowerCase()) ||
						blog.excerpt.toLowerCase().includes(term.toLowerCase()) ||
						blog.content.toLowerCase().includes(term.toLowerCase()) ||
						blog.tags.some(tag => tag.toLowerCase().includes(term.toLowerCase()));

					expect(isRelevant).toBe(true);
				});
			});
		});

		it('should handle plurals and variations', async () => {
			await loadBlogs();

			const variations = [
				['component', 'components'],
				['tutorial', 'tutorials'],
				['guide', 'guides']
			];

			variations.forEach(([singular, plural]) => {
				const singularResults = searchBlogs(singular);
				const pluralResults = searchBlogs(plural);

				// Should find relevant results for both forms
				expect(Array.isArray(singularResults)).toBe(true);
				expect(Array.isArray(pluralResults)).toBe(true);
			});
		});

		it('should limit result count for performance', async () => {
			await loadBlogs();

			// Search for a very common term
			const results = searchBlogs('the');

			// Should limit results to prevent performance issues
			expect(results.length).toBeLessThanOrEqual(50); // Reasonable limit
		});

		it('should return empty array for no matches', async () => {
			await loadBlogs();

			const noMatchQuery = 'xyzabc123nonexistent';
			const results = searchBlogs(noMatchQuery);

			expect(results).toEqual([]);
		});
	});
});
