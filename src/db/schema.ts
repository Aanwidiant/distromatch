// src/db/schema.ts
import {
    serial,
    text,
    timestamp,
    integer,
    numeric,
    uuid,
    varchar,
    pgTable,
    pgEnum,
    uniqueIndex,
    index,
    boolean,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ENUMS

export const userRoleEnum = pgEnum('user_role', ['ADMIN', 'USER']);
export const userStatusEnum = pgEnum('user_status', ['ACTIVE', 'INACTIVE', 'SUSPENDED']);
export const authProviderEnum = pgEnum('auth_provider', ['SYSTEM', 'GOOGLE']);
export const distroStatusEnum = pgEnum('distro_status', ['ACTIVE', 'INACTIVE', 'DEPRECATED']);
export const systemSettingStatusEnum = pgEnum('system_setting_status_enum', ['ACTIVE', 'INACTIVE']);
export const distroLevelEnum = pgEnum('distro_level', [
    'Beginner Friendly',
    'Intermediate Experience Required',
    'Advanced Experience Required',
]);

// USERS TABLE

export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    name: varchar('name', { length: 255 }).notNull(),
    username: varchar('username', { length: 255 }).notNull(),
    password: varchar('password', { length: 255 }).notNull(),
    photo: text('photo'),
    role: userRoleEnum('role').default('USER'),
    status: userStatusEnum('status').default('ACTIVE'),
    email_verified: boolean('email_verified').default(false).notNull(),
    refresh_token: text('refresh_token'),
    session_expired_at: timestamp('session_expired_at'),
    provider: authProviderEnum('provider').default('SYSTEM').notNull(),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow(),
});

// DISTROS TABLE

export const distros = pgTable(
    'distros',
    {
        id: serial('id').primaryKey(),

        name: varchar('name', { length: 100 }).notNull().unique(),
        slug: varchar('slug', { length: 100 }).notNull().unique(),

        logo: varchar('logo', { length: 255 }),
        homepage_url: varchar('homepage_url', { length: 255 }),

        docs_url: text('docs_url').array().notNull().default([]),

        total_reviews: integer('total_reviews').notNull().default(0),

        overall_rating: numeric('overall_rating', {
            precision: 3,
            scale: 2,
        })
            .notNull()
            .default('0'),

        ux_rating: numeric('ux_rating', {
            precision: 3,
            scale: 2,
        })
            .notNull()
            .default('0'),

        performance_rating: numeric('performance_rating', {
            precision: 3,
            scale: 2,
        })
            .notNull()
            .default('0'),

        stability_rating: numeric('stability_rating', {
            precision: 3,
            scale: 2,
        })
            .notNull()
            .default('0'),

        features_rating: numeric('features_rating', {
            precision: 3,
            scale: 2,
        })
            .notNull()
            .default('0'),

        support_rating: numeric('support_rating', {
            precision: 3,
            scale: 2,
        })
            .notNull()
            .default('0'),

        target_user_level: distroLevelEnum('target_user_level').notNull(),

        distro_type: text('distro_type').array().notNull().default([]),
        based_on: text('based_on').array().notNull().default([]),
        origin_country: text('origin_country').array().notNull().default([]),
        architectures: text('architectures').array().notNull().default([]),
        desktop_environments: text('desktop_environments').array().notNull().default([]),
        categories: text('categories').array().notNull().default([]),

        status: distroStatusEnum('status').notNull().default('ACTIVE'),

        description: text('description').notNull().default(''),

        source_url: text('source_url').array().notNull().default([]),

        taken_at: timestamp('taken_at').notNull(),

        created_at: timestamp('created_at').notNull().defaultNow(),
        updated_at: timestamp('updated_at').notNull().defaultNow(),
    },
    (table) => ({
        nameIdx: uniqueIndex('idx_distros_name').on(table.name),
        slugIdx: uniqueIndex('idx_distros_slug').on(table.slug),
        statusIdx: index('idx_distros_status').on(table.status),
        targetLevelIdx: index('idx_distros_target_level').on(table.target_user_level),
    })
);

// DSS_RUNS TABLE

export const dss_runs = pgTable(
    'dss_runs',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        user_id: uuid('user_id')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        created_at: timestamp('created_at').defaultNow(),
    },
    (table) => ({
        userIdx: index('idx_dss_runs_user').on(table.user_id),
    })
);

// SURVEYS TABLE

export const surveys = pgTable(
    'surveys',
    {
        id: serial('id').primaryKey(),
        dss_run_id: uuid('dss_run_id')
            .notNull()
            .references(() => dss_runs.id, { onDelete: 'cascade' }),

        q1_ux: integer('q1_ux').notNull(),
        q2_ux: integer('q2_ux').notNull(),
        q3_performance: integer('q3_performance').notNull(),
        q4_performance: integer('q4_performance').notNull(),
        q5_stability: integer('q5_stability').notNull(),
        q6_stability: integer('q6_stability').notNull(),
        q7_features: integer('q7_features').notNull(),
        q8_features: integer('q8_features').notNull(),
        q9_support: integer('q9_support').notNull(),
        q10_support: integer('q10_support').notNull(),
        q11_level_pref: integer('q11_level_pref').notNull(),
        q12_level_pref: integer('q12_level_pref').notNull(),

        created_at: timestamp('created_at').defaultNow(),
        updated_at: timestamp('updated_at').defaultNow(),
    },
    (table) => ({
        dssRunIdx: index('idx_surveys_dss_run').on(table.dss_run_id),
    })
);

// WEIGHT_SURVEY TABLE

export const weight_survey = pgTable(
    'weight_survey',
    {
        id: serial('id').primaryKey(),
        dss_run_id: uuid('dss_run_id')
            .notNull()
            .references(() => dss_runs.id, { onDelete: 'cascade' }),
        ux_weight: numeric('ux_weight', {
            precision: 14,
            scale: 10,
        }).notNull(),
        performance_weight: numeric('performance_weight', {
            precision: 14,
            scale: 10,
        }).notNull(),
        stability_weight: numeric('stability_weight', {
            precision: 14,
            scale: 10,
        }).notNull(),
        features_weight: numeric('features_weight', {
            precision: 14,
            scale: 10,
        }).notNull(),
        support_weight: numeric('support_weight', {
            precision: 14,
            scale: 10,
        }).notNull(),

        user_pref_score: integer('user_pref_score').notNull(),
        user_pref_level: distroLevelEnum('user_pref_level').notNull(),

        created_at: timestamp('created_at').defaultNow(),
        updated_at: timestamp('updated_at').defaultNow(),
    },
    (table) => ({
        dssRunIdx: index('idx_weight_survey_dss_run').on(table.dss_run_id),
        prefLevelIdx: index('idx_weight_survey_pref_level').on(table.user_pref_level),
    })
);

// TOPSIS_RESULT TABLE

export const topsis_result = pgTable(
    'topsis_result',
    {
        id: serial('id').primaryKey(),
        dss_run_id: uuid('dss_run_id')
            .notNull()
            .references(() => dss_runs.id, { onDelete: 'cascade' }),
        distro_id: integer('distro_id')
            .notNull()
            .references(() => distros.id, { onDelete: 'cascade' }),

        normalized_ux: numeric('normalized_ux', { precision: 14, scale: 10 }),
        normalized_performance: numeric('normalized_performance', { precision: 14, scale: 10 }),
        normalized_stability: numeric('normalized_stability', { precision: 14, scale: 10 }),
        normalized_features: numeric('normalized_features', { precision: 14, scale: 10 }),
        normalized_support: numeric('normalized_support', { precision: 14, scale: 10 }),

        weighted_ux: numeric('weighted_ux', { precision: 14, scale: 10 }),
        weighted_performance: numeric('weighted_performance', { precision: 14, scale: 10 }),
        weighted_stability: numeric('weighted_stability', { precision: 14, scale: 10 }),
        weighted_features: numeric('weighted_features', { precision: 14, scale: 10 }),
        weighted_support: numeric('weighted_support', { precision: 14, scale: 10 }),

        distance_ideal_positive: numeric('distance_ideal_positive', {
            precision: 14,
            scale: 10,
        }),
        distance_ideal_negative: numeric('distance_ideal_negative', {
            precision: 14,
            scale: 10,
        }),
        cc_score: numeric('cc_score', { precision: 14, scale: 10 }).notNull(),
        created_at: timestamp('created_at').defaultNow(),
    },
    (table) => ({
        dssRunIdx: index('idx_topsis_dss_run').on(table.dss_run_id),
        distroIdx: index('idx_topsis_distro').on(table.distro_id),
        ccIdx: index('idx_topsis_cc').on(table.cc_score),

        uniqueRunDistro: uniqueIndex('uniq_topsis_run_distro').on(
            table.dss_run_id,
            table.distro_id
        ),
    })
);

// TOPSIS_META TABLE

export const topsis_meta = pgTable(
    'topsis_meta',
    {
        id: uuid('id').primaryKey().defaultRandom(),

        dss_run_id: uuid('dss_run_id')
            .notNull()
            .references(() => dss_runs.id, { onDelete: 'cascade' }),

        denominator_ux: numeric('denominator_ux', {
            precision: 14,
            scale: 10,
        }),

        denominator_performance: numeric('denominator_performance', {
            precision: 14,
            scale: 10,
        }),

        denominator_stability: numeric('denominator_stability', {
            precision: 14,
            scale: 10,
        }),

        denominator_features: numeric('denominator_features', {
            precision: 14,
            scale: 10,
        }),

        denominator_support: numeric('denominator_support', {
            precision: 14,
            scale: 10,
        }),

        positive_ux: numeric('positive_ux', {
            precision: 14,
            scale: 10,
        }),

        positive_performance: numeric('positive_performance', {
            precision: 14,
            scale: 10,
        }),

        positive_stability: numeric('positive_stability', {
            precision: 14,
            scale: 10,
        }),

        positive_features: numeric('positive_features', {
            precision: 14,
            scale: 10,
        }),

        positive_support: numeric('positive_support', {
            precision: 14,
            scale: 10,
        }),

        negative_ux: numeric('negative_ux', {
            precision: 14,
            scale: 10,
        }),

        negative_performance: numeric('negative_performance', {
            precision: 14,
            scale: 10,
        }),

        negative_stability: numeric('negative_stability', {
            precision: 14,
            scale: 10,
        }),

        negative_features: numeric('negative_features', {
            precision: 14,
            scale: 10,
        }),

        negative_support: numeric('negative_support', {
            precision: 14,
            scale: 10,
        }),

        created_at: timestamp('created_at').defaultNow(),
    },
    (table) => ({
        runIdx: index('idx_topsis_meta_run').on(table.dss_run_id),

        uniqueRun: uniqueIndex('uniq_topsis_meta_run').on(table.dss_run_id),
    })
);

// PENALTY_RESULTS TABLE

export const penalty_results = pgTable(
    'penalty_results',
    {
        id: serial('id').primaryKey(),
        dss_run_id: uuid('dss_run_id')
            .notNull()
            .references(() => dss_runs.id, { onDelete: 'cascade' }),
        distro_id: integer('distro_id')
            .notNull()
            .references(() => distros.id, { onDelete: 'cascade' }),

        distance: numeric('distance', { precision: 5, scale: 2 }).notNull(),
        distance_normalized: numeric('distance_normalized', {
            precision: 5,
            scale: 2,
        }).notNull(),

        penalty_value: numeric('penalty_value', { precision: 6, scale: 4 }).notNull(),

        utility_score: numeric('utility_score', { precision: 14, scale: 10 }).notNull(),

        created_at: timestamp('created_at').defaultNow(),
    },
    (table) => ({
        dssRunIdx: index('idx_penalty_dss_run').on(table.dss_run_id),
        distroIdx: index('idx_penalty_distro').on(table.distro_id),
        utilityIdx: index('idx_penalty_utility').on(table.utility_score),

        uniqueRunDistro: uniqueIndex('uniq_penalty_run_distro').on(
            table.dss_run_id,
            table.distro_id
        ),
    })
);

// BAYESIAN_RESULTS TABLE

export const bayesian_results = pgTable(
    'bayesian_results',
    {
        id: serial('id').primaryKey(),
        dss_run_id: uuid('dss_run_id')
            .notNull()
            .references(() => dss_runs.id, { onDelete: 'cascade' }),
        distro_id: integer('distro_id')
            .notNull()
            .references(() => distros.id, { onDelete: 'cascade' }),
        shrinkage_coefficient: numeric('shrinkage_coefficient', {
            precision: 14,
            scale: 10,
        }).notNull(),

        confidence_adjusted_score: numeric('confidence_adjusted_score', {
            precision: 14,
            scale: 10,
        }).notNull(),

        created_at: timestamp('created_at').defaultNow(),
    },
    (table) => ({
        dssRunIdx: index('idx_bayesian_dss_run').on(table.dss_run_id),
        distroIdx: index('idx_bayesian_distro').on(table.distro_id),
        confidenceIdx: index('idx_bayesian_confidence').on(table.confidence_adjusted_score),

        uniqueRunDistro: uniqueIndex('uniq_bayesian_run_distro').on(
            table.dss_run_id,
            table.distro_id
        ),
    })
);

// RANKINGS TABLE

export const rankings = pgTable(
    'rankings',
    {
        id: serial('id').primaryKey(),
        dss_run_id: uuid('dss_run_id')
            .notNull()
            .references(() => dss_runs.id, { onDelete: 'cascade' }),
        distro_id: integer('distro_id')
            .notNull()
            .references(() => distros.id, { onDelete: 'cascade' }),

        rank_position: integer('rank_position').notNull(),

        created_at: timestamp('created_at').defaultNow(),
        updated_at: timestamp('updated_at').defaultNow(),
    },
    (table) => ({
        dssRunIdx: index('idx_rankings_dss_run').on(table.dss_run_id),
        distroIdx: index('idx_rankings_distro').on(table.distro_id),
        rankIdx: index('idx_rankings_position').on(table.rank_position),

        uniqueRunDistro: uniqueIndex('uniq_rankings_run_distro').on(
            table.dss_run_id,
            table.distro_id
        ),
    })
);

// SYSTEM_SETTINGS TABLE

export const system_settings = pgTable(
    'system_settings',
    {
        id: serial('id').primaryKey(),
        name: varchar('name', { length: 100 }).notNull().unique(),

        lambda_param: numeric('lambda_param', { precision: 3, scale: 2 }).default('-0.5').notNull(),
        max_distance: integer('max_distance').default(2).notNull(),
        median_reviews: integer('median_reviews'),
        total_distros: integer('total_distros').default(30).notNull(),
        top_n_recommendations: integer('top_n_recommendations').default(5).notNull(),

        status: systemSettingStatusEnum('status').default('INACTIVE'),

        updated_by: uuid('updated_by').references(() => users.id, {
            onDelete: 'set null',
        }),
        created_at: timestamp('created_at').defaultNow(),
        updated_at: timestamp('updated_at').defaultNow(),
    },
    (table) => ({
        statusIdx: index('idx_settings_status').on(table.status),
        updatedByIdx: index('idx_settings_updated_by').on(table.updated_by),
    })
);

// RELATIONS

export const usersRelations = relations(users, ({ many }) => ({
    dss_runs: many(dss_runs),
    system_settings: many(system_settings),
}));

export const surveysRelations = relations(surveys, ({ one }) => ({
    dss_run: one(dss_runs, {
        fields: [surveys.dss_run_id],
        references: [dss_runs.id],
    }),
}));

export const dssRunsRelations = relations(dss_runs, ({ one, many }) => ({
    user: one(users, {
        fields: [dss_runs.user_id],
        references: [users.id],
    }),

    weight_survey: many(weight_survey),
    topsis_results: many(topsis_result),
    penalty_results: many(penalty_results),
    bayesian_results: many(bayesian_results),
    rankings: many(rankings),
    topsis_meta: one(topsis_meta, {
        fields: [dss_runs.id],
        references: [topsis_meta.dss_run_id],
    }),
}));

export const weightSurveyRelations = relations(weight_survey, ({ one }) => ({
    dss_run: one(dss_runs, {
        fields: [weight_survey.dss_run_id],
        references: [dss_runs.id],
    }),
}));

export const distrosRelations = relations(distros, ({ many }) => ({
    topsis_results: many(topsis_result),
    penalty_results: many(penalty_results),
    bayesian_results: many(bayesian_results),
    rankings: many(rankings),
}));

export const topsisResultRelations = relations(topsis_result, ({ one }) => ({
    dss_run: one(dss_runs, {
        fields: [topsis_result.dss_run_id],
        references: [dss_runs.id],
    }),

    distro: one(distros, {
        fields: [topsis_result.distro_id],
        references: [distros.id],
    }),
}));

export const topsisMetaRelations = relations(topsis_meta, ({ one }) => ({
    dss_run: one(dss_runs, {
        fields: [topsis_meta.dss_run_id],
        references: [dss_runs.id],
    }),
}));

export const penaltyResultsRelations = relations(penalty_results, ({ one }) => ({
    dss_run: one(dss_runs, {
        fields: [penalty_results.dss_run_id],
        references: [dss_runs.id],
    }),

    distro: one(distros, {
        fields: [penalty_results.distro_id],
        references: [distros.id],
    }),
}));

export const bayesianResultsRelations = relations(bayesian_results, ({ one }) => ({
    dss_run: one(dss_runs, {
        fields: [bayesian_results.dss_run_id],
        references: [dss_runs.id],
    }),

    distro: one(distros, {
        fields: [bayesian_results.distro_id],
        references: [distros.id],
    }),
}));

export const rankingsRelations = relations(rankings, ({ one }) => ({
    dss_run: one(dss_runs, {
        fields: [rankings.dss_run_id],
        references: [dss_runs.id],
    }),

    distro: one(distros, {
        fields: [rankings.distro_id],
        references: [distros.id],
    }),
}));

export const systemSettingsRelations = relations(system_settings, ({ one }) => ({
    updated_by_user: one(users, {
        fields: [system_settings.updated_by],
        references: [users.id],
    }),
}));

// TYPE EXPORTS

export type User = typeof users.$inferSelect;
export type UserInsert = typeof users.$inferInsert;

export type Distro = typeof distros.$inferSelect;
export type DistroInsert = typeof distros.$inferInsert;

export type Survey = typeof surveys.$inferSelect;
export type SurveyInsert = typeof surveys.$inferInsert;

export type WeightSurvey = typeof weight_survey.$inferSelect;
export type WeightSurveyInsert = typeof weight_survey.$inferInsert;

export type TopsisResult = typeof topsis_result.$inferSelect;
export type TopsisResultInsert = typeof topsis_result.$inferInsert;

export type PenaltyResult = typeof penalty_results.$inferSelect;
export type PenaltyResultInsert = typeof penalty_results.$inferInsert;

export type BayesianResult = typeof bayesian_results.$inferSelect;
export type BayesianResultInsert = typeof bayesian_results.$inferInsert;

export type Ranking = typeof rankings.$inferSelect;
export type RankingInsert = typeof rankings.$inferInsert;

export type SystemSetting = typeof system_settings.$inferSelect;
export type SystemSettingInsert = typeof system_settings.$inferInsert;

export type DistroLevel = (typeof distroLevelEnum.enumValues)[number];
