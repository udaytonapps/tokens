<?php

// The SQL to uninstall this tool
$DATABASE_UNINSTALL = array();

/** Table names */
$TOKENS_CONFIG_TABLE_NAME = "{$CFG->dbprefix}tokens_configuration";
$TOKENS_INSTRUCTOR_OPTION_TABLE_NAME = "{$CFG->dbprefix}tokens_instructor_option";
$TOKENS_CATEGORY_TABLE_NAME = "{$CFG->dbprefix}tokens_category";
$TOKENS_REQUEST_TABLE_NAME = "{$CFG->dbprefix}tokens_request";
$TOKENS_AWARD_TABLE_NAME = "{$CFG->dbprefix}tokens_award";

/** Table schemas */
$TOKENS_CONFIGURATION = "CREATE TABLE {$TOKENS_CONFIG_TABLE_NAME} (

    /* PRIMARY KEY */
    configuration_id              INTEGER NOT NULL AUTO_INCREMENT,
    
    /* COMMON COLS */
    user_id                 INTEGER NOT NULL, /* ID of the instructor the created the settings */
    context_id              INTEGER NOT NULL, /* Tracked and scoped, this is the course */
    link_id                 INTEGER NOT NULL, /* Tracked but not scoped, this is the instance */
    created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    /* TOKEN COLS */
    initial_tokens          INTEGER NOT NULL,
    use_by_date             DATETIME NOT NULL, /* Tokens cannot be used AFTER this date */
    notifications_pref      BOOLEAN,

    PRIMARY KEY(configuration_id),

    UNIQUE(context_id, link_id)

) ENGINE = InnoDB DEFAULT CHARSET=utf8";

$TOKENS_INSTRUCTOR_OPTION = "CREATE TABLE {$TOKENS_INSTRUCTOR_OPTION_TABLE_NAME} (

    /* PRIMARY KEY */
    option_id               INTEGER NOT NULL AUTO_INCREMENT,
    
    /* COMMON COLS */
    user_id                 INTEGER NOT NULL, /* ID of the instructor that chose the option */
    created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    /* TOKEN COLS */
    configuration_id        INTEGER NOT NULL, /* FK reference to the configuration */
    notifications_pref      BOOLEAN,

    PRIMARY KEY(option_id),

    CONSTRAINT `fk_option_configuration`
        FOREIGN KEY (`configuration_id`)
        REFERENCES `{$TOKENS_CONFIG_TABLE_NAME}` (`configuration_id`)
        ON DELETE CASCADE

) ENGINE = InnoDB DEFAULT CHARSET=utf8";

$TOKENS_CATEGORY = "CREATE TABLE {$TOKENS_CATEGORY_TABLE_NAME} (

    /* PRIMARY KEY */
    category_id             INTEGER NOT NULL AUTO_INCREMENT,
    
    /* COMMON COLS */
    created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    /* TOKEN COLS */
    configuration_id        INTEGER NOT NULL, /* FK reference to the configuration */
    category_name           VARCHAR(255) NOT NULL,
    sort_order              INTEGER NOT NULL,
    token_cost              INTEGER NOT NULL,

    PRIMARY KEY(category_id),

    CONSTRAINT `fk_category_configuration`
        FOREIGN KEY (`configuration_id`)
        REFERENCES `{$TOKENS_CONFIG_TABLE_NAME}` (`configuration_id`)
        ON DELETE CASCADE

) ENGINE = InnoDB DEFAULT CHARSET=utf8";

$TOKENS_REQUEST = "CREATE TABLE {$TOKENS_REQUEST_TABLE_NAME} (

    /* PRIMARY KEY */
    request_id              INTEGER NOT NULL AUTO_INCREMENT,
    
    /* COMMON COLS */
    user_id                 INTEGER NOT NULL, /** Learner */
    created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    /* TOKEN COLS */
    configuration_id        INTEGER NOT NULL, /* FK reference to the configuration */
    category_id             INTEGER NOT NULL, /* FK reference to category */
    learner_comment         TEXT NOT NULL,
    instructor_comment      TEXT,
    instructor_id           INTEGER,
    status_name             VARCHAR(255) NOT NULL,
    status_updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP, /* Will be submitted at first */

    PRIMARY KEY(request_id),

    CONSTRAINT `fk_request_configuration`
        FOREIGN KEY (`configuration_id`)
        REFERENCES `{$TOKENS_CONFIG_TABLE_NAME}` (`configuration_id`)
        ON DELETE CASCADE,
    CONSTRAINT `fk_request_category`
        FOREIGN KEY (`category_id`)
        REFERENCES `{$TOKENS_CATEGORY_TABLE_NAME}` (`category_id`)

) ENGINE = InnoDB DEFAULT CHARSET=utf8";

$TOKENS_AWARD = "CREATE TABLE {$TOKENS_AWARD_TABLE_NAME} (

    /* PRIMARY KEY */
    award_id                INTEGER NOT NULL AUTO_INCREMENT,
    
    /* COMMON COLS */
    created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    /* TOKEN COLS */
    configuration_id        INTEGER NOT NULL, /* FK reference to the configuration */
    recipient_id            INTEGER NOT NULL, /* Id of the recipient */
    comment                 TEXT NOT NULL,
    award_count             INTEGER NOT NULL,

    PRIMARY KEY(award_id),

    CONSTRAINT `fk_award_configuration`
        FOREIGN KEY (`configuration_id`)
        REFERENCES `{$TOKENS_CONFIG_TABLE_NAME}` (`configuration_id`)
        ON DELETE CASCADE

) ENGINE = InnoDB DEFAULT CHARSET=utf8";

/** Table installation (if tables don't exist) */
$DATABASE_INSTALL = array(
    array($TOKENS_CONFIG_TABLE_NAME, $TOKENS_CONFIGURATION),
    array($TOKENS_CATEGORY_TABLE_NAME, $TOKENS_CATEGORY),
    array($TOKENS_REQUEST_TABLE_NAME, $TOKENS_REQUEST),
    array($TOKENS_INSTRUCTOR_OPTION_TABLE_NAME, $TOKENS_INSTRUCTOR_OPTION),
    array($TOKENS_AWARD_TABLE_NAME, $TOKENS_AWARD),
);
