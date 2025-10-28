#!/usr/bin/env node

/**
 * Database setup verification script
 * Run this to test the database initialization and basic operations
 */

import { initializePortfolioDatabase } from '../src/lib/database/index.js';

async function testDatabaseSetup() {
  console.log('🔧 Testing database setup...\n');

  try {
    // Initialize database
    const { blogPostDAO, projectDAO, skillDAO } = initializePortfolioDatabase();

    // Test skills
    console.log('📊 Testing skills...');
    const skills = skillDAO.getAll();
    console.log(`Found ${skills.length} default skills`);
    if (skills.length > 0) {
      console.log(`- ${skills[0].name} (${skills[0].category})`);
    }

    // Test basic project operations
    console.log('\n🚀 Testing projects...');
    const projects = projectDAO.getAll();
    console.log(`Found ${projects.data.length} projects`);

    // Test basic blog operations
    console.log('\n📝 Testing blog posts...');
    const posts = blogPostDAO.getAll();
    console.log(`Found ${posts.data.length} blog posts`);

    console.log('\n✅ Database setup test completed successfully!');
  } catch (error) {
    console.error('\n❌ Database setup test failed:', error);
    process.exit(1);
  }
}

testDatabaseSetup();
