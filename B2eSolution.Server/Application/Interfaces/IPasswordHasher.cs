﻿namespace B2eSolution.Server.Application.Interfaces
{
    public interface IPasswordHasher { string Hash(string plain); bool Verify(string plain, string hash); }
}
