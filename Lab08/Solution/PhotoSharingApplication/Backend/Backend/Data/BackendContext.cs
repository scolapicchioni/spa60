using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Backend.Models;

namespace Backend.Data
{
    public class BackendContext : DbContext
    {
        public BackendContext (DbContextOptions<BackendContext> options)
            : base(options)
        {
        }

        public DbSet<Backend.Models.Photo> Photo { get; set; } = default!;
    }
}
