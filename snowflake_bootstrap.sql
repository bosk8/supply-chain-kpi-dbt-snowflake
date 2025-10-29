-- Snowflake Bootstrap Script
-- Run this as an administrator to set up the analytics infrastructure
-- 
-- Prerequisites:
-- - Snowflake account with administrative privileges
-- - Ability to create roles, warehouses, databases, and schemas

-- Create role for analytics operations
CREATE ROLE IF NOT EXISTS ANALYTICS_ROLE;

-- Create compute warehouse (XSMALL for cost control)
CREATE WAREHOUSE IF NOT EXISTS WH_TINY 
  WITH 
    WAREHOUSE_SIZE = XSMALL 
    AUTO_SUSPEND = 60 
    AUTO_RESUME = TRUE;

-- Create database and schemas
CREATE DATABASE IF NOT EXISTS ANALYTICS;
CREATE SCHEMA IF NOT EXISTS ANALYTICS.RAW;
CREATE SCHEMA IF NOT EXISTS ANALYTICS.MODEL;

-- Grant warehouse usage
GRANT USAGE ON WAREHOUSE WH_TINY TO ROLE ANALYTICS_ROLE;

-- Grant database usage
GRANT USAGE ON DATABASE ANALYTICS TO ROLE ANALYTICS_ROLE;

-- Grant schema usage
GRANT USAGE ON SCHEMA ANALYTICS.RAW TO ROLE ANALYTICS_ROLE;
GRANT USAGE ON SCHEMA ANALYTICS.MODEL TO ROLE ANALYTICS_ROLE;

-- Grant permissions on MODEL schema for dbt operations
GRANT CREATE TABLE ON SCHEMA ANALYTICS.MODEL TO ROLE ANALYTICS_ROLE;
GRANT CREATE VIEW ON SCHEMA ANALYTICS.MODEL TO ROLE ANALYTICS_ROLE;
GRANT CREATE STAGE ON SCHEMA ANALYTICS.MODEL TO ROLE ANALYTICS_ROLE;

-- Grant permissions on RAW schema for seed loading
GRANT CREATE TABLE ON SCHEMA ANALYTICS.RAW TO ROLE ANALYTICS_ROLE;

-- Optional: Create service user for CI/CD (uncomment and set password)
-- CREATE USER IF NOT EXISTS DBT_SVC 
--   PASSWORD='<SET_SECURE_PASSWORD>' 
--   DEFAULT_ROLE=ANALYTICS_ROLE 
--   MUST_CHANGE_PASSWORD=TRUE;
-- GRANT ROLE ANALYTICS_ROLE TO USER DBT_SVC;
