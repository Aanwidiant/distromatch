// export async function canAccessDssRun(
//     dssRunId: string,
//     user?: JwtPayload
// ) {
//     const dssRun = await db.query.dss_runs.findFirst({
//         where: eq(dss_runs.id, dssRunId),
//     });

//     if (!dssRun) {
//         return {
//             allowed: false,
//             reason: 'NOT_FOUND',
//         };
//     }

//     // public/share
//     if (dssRun.share) {
//         return {
//             allowed: true,
//             dssRun,
//         };
//     }

//     // belum login
//     if (!user) {
//         return {
//             allowed: false,
//             reason: 'UNAUTHORIZED',
//         };
//     }

//     // admin
//     if (user.role === 'ADMIN') {
//         return {
//             allowed: true,
//             dssRun,
//         };
//     }

//     // owner
//     if (dssRun.user_id === user.id) {
//         return {
//             allowed: true,
//             dssRun,
//         };
//     }

//     return {
//         allowed: false,
//         reason: 'FORBIDDEN',
//     };
// }
