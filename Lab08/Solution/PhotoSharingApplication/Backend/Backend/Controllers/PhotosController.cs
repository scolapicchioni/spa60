using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using IdentityModel;
using System.Security.Claims;

namespace Backend.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    public class PhotosController : ControllerBase
    {
        private readonly BackendContext _context;
        private readonly IAuthorizationService _authorizationService;

        public PhotosController(BackendContext context, IAuthorizationService authorizationService) {
            _context = context;
            _authorizationService = authorizationService;
        }

        // GET: api/Photos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Photo>>> GetPhoto()
        {
            return await _context.Photo.ToListAsync();
        }

        // GET: api/Photos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Photo>> GetPhoto(int id)
        {
            var photo = await _context.Photo.FindAsync(id);

            if (photo == null)
            {
                return NotFound();
            }

            return photo;
        }

        // PUT: api/Photos/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> PutPhoto(int id, Photo photo)
        {
            if (id != photo.Id) {
                return BadRequest();
            }
            Photo original = await _context.Photo.AsNoTracking<Photo>().FirstOrDefaultAsync(p => p.Id == id);
            AuthorizationResult authresult = await _authorizationService.AuthorizeAsync(User, original, "PhotoOwner");
            if (!authresult.Succeeded) {
                return new ForbidResult();
            }

            _context.Entry(photo).State = EntityState.Modified;

            try {
                await _context.SaveChangesAsync();
            } catch (DbUpdateConcurrencyException) {
                if (!PhotoExists(id)) {
                    return NotFound();
                } else {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Photos
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Photo>> PostPhoto(Photo photo)
        {
            photo.UserName = User.FindFirst(c => c.Type == ClaimTypes.Name && c.Issuer == "https://localhost:5001").Value;
            _context.Photo.Add(photo);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPhoto", new { id = photo.Id }, photo);
        }

        // DELETE: api/Photos/5
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<ActionResult<Photo>> DeletePhoto(int id)
        {
            var photo = await _context.Photo.FindAsync(id);
            AuthorizationResult authresult = await _authorizationService.AuthorizeAsync(User, photo, "PhotoOwner");
            if (!authresult.Succeeded) {
                return new ForbidResult();
            }

            if (photo == null) {
                return NotFound();
            }

            _context.Photo.Remove(photo);
            await _context.SaveChangesAsync();

            return photo;
        }

        private bool PhotoExists(int id)
        {
            return _context.Photo.Any(e => e.Id == id);
        }
    }
}
